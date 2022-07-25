#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv;

const express = require('express');
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;
const session =  require('express-session');
const path = require('path');

const passport = require('passport');
const handlebars = require('express-handlebars');

const { initializePassport } = require('./models/Passport');
const apiRouter = require("./routes/apiRouter"); // api temporal router.
const mainRouter = require("./routes/mainRouter");
const loggingRouter = require("./middlewares/loggingMiddleware");
const routeErrorHandler = require("./middlewares/routeErrorHandler");
const mongostoreConfig = require('./config/mongoStoreConfig');

const {engine} = handlebars;

const app = express();
const server = require('http').Server(app);
const PORT = (argv.port !== undefined)?argv.port:8080;
const MODE = argv.mode || 'fork';
const GZIP = argv.gzip || false;
if(GZIP){
    console.log('entro');
    const compression = require('compression');
    app.use(compression());
}

// Handlebars settings
app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "layout.hbs",
    })
);
app.set("views", "./views");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname ,'public')));
// app general settings
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session(mongostoreConfig));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use("/", loggingRouter, mainRouter, routeErrorHandler);
app.use("/api", loggingRouter, apiRouter, routeErrorHandler);


if(MODE !== 'fork'){
    if (cluster.isMaster) {
        //console.log(totalCPUs);
        for (let i = 0; i < totalCPUs; i++) {
            try {
                cluster.fork();
            } catch (error) {
                console.log(error);
            }        
        }
    
        cluster.on("exit", (worker, code, signal) => {
            //console.log(worker.process.pid);
            try {
                cluster.fork();
            } catch (error) {
                console.log(error);
            }
        });
    }else{
        server.listen(PORT, () => {
            console.log("Server Up");
            console.log(`Escuchando puerto: ${server.address().port}`);
        });

    }//end cluster isMain
}else{
    server.listen(PORT, () => {
        console.log("Server Up");
        console.log(`Escuchando puerto: ${server.address().port}`);
    });
}
