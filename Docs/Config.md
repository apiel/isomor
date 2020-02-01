### Configuration

The default configuration should be most of the time the right one for implementing an application with isomor. In case you still need to use some custom configuration, you can use environmnet variable. You can either pass the variable directly from the command line or you can use a dotenv file `isomor.env` in the root of your project.

#### Common

`ISOMOR_PKG_NAME` is use to define the name of your application/package. This variable is mainly used in the generate API to define the path of the endpoints. If not define, it will take the package name in package.json file.

`ISOMOR_DIST_APP_FOLDER` path of the folder after transpiling, default `./src`

`ISOMOR_SERVER_FOLDER` path of the folder containing the files executed on the server, default `/server`

`ISOMOR_JSON_SCHEMA_FOLDER` destination path where the json schema files are saved for validation of the endpoints, default `./json-schema`

`ISOMOR_FILES_PATTERN` file pattern to server files.

#### Transpiler

`ISOMOR_SRC_FOLDER` path of the source folder, by default `./src-isomor`

`ISOMOR_NO_VALIDATION` set to `true` to disable json schema validation of the endpoints, default `false`

`ISOMOR_NO_TYPES` set to `true` to transform all types to `any` while transpiling, default `false`

`ISOMOR_WATCH` set to `true` to have transpiler in watch mode, default `false`

`ISOMOR_NO_SERVER_IMPORT` set to `true` to remove all server import, default `false`

`ISOMOR_NO_DECORATOR` set to `true` to disable typescript decorator, default `false`

#### Server

`ISOMOR_DIST_SERVER_FOLDER` path of the destination folder after server file has been transpiled to JS, default `./dist-server`

`ISOMOR_PORT` default `3005`

`ISOMOR_STATIC_FOLDER` path to static folder, default `null`

`ISOMOR_STARTUP_FILE` path to startup file, default `startup/index.js`,

#### WebSocket

`ISOMOR_WS` RegExp matching the function name to use WebSocket instead of Http, `.*` to use only WebSocket.
