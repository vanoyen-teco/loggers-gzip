# Entregable: Loggers & Gzip
## Alumno: Juan Manuel Rodriguez Van Oyen

Desafío: Servidores - Loggers & Gzip

Para probar la aplicación crear el archivo .env en base al .env_example

Configurar opcionalmente un puerto: 

```
app.js --port=8080
```

Configuración de ejemplo servidor Nginx: Ver config. (https://github.com/vanoyen-teco/loggers-gzip/blob/main/nginx_example/nginx.conf)

Compresion Gzip: Se encuentra en modo ON en la configuración de nginx. En caso de no usar nginx se puede habilitar con argumentos:

```
--gzip=true
```

Implementación de Logging: 
- Info: de rutas y método.
- Warning: ruta y método de rutas inexistentes.
- Error: Implementado en "register" y "login" erors.

Archivos de error:  warn.log y error.log  en carpeta "logs"