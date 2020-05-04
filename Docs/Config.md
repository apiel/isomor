### Configuration

The default configuration should be most of the time the right one for implementing an application with isomor. In case you still need to use some custom configuration, you can use environmnet variables. You can either pass the variable directly from the command line or you can use a dotenv file `isomor.env` in the root of your project.

#### Common

`ISOMOR_MODULE_NAME` is use to define the name of your application/package. This variable is mainly used in to generate API to define the path of the endpoints, default `api`.

`ISOMOR_MODULE_FOLDER` path of the folder of the generated module, default `./node_modules/api`

`ISOMOR_SERVER_FOLDER` path of the folder containing the files executed on the server, default `./node_modules/api/server`

#### Transpiler

`ISOMOR_SRC_FOLDER` path of the source folder, by default `./api`

`ISOMOR_NO_VALIDATION` set to `true` to disable json schema validation of the endpoints, default `false`

`ISOMOR_WATCH` set to `true` to have transpiler in watch mode, default `false`

#### Server

`ISOMOR_PORT` default `3005`

`ISOMOR_STATIC_FOLDER` path to static folder, default `null`

`ISOMOR_STARTUP_FILE` path to startup file, default `startup/index.js`,

#### WebSocket

`ISOMOR_WS` RegExp matching the function name to use WebSocket instead of Http, `.*` to use only WebSocket.

`ISOMOR_WS_BASE_URL` base url of the websocket server, default `ws://127.0.0.1:3005`

`ISOMOR_WS_TIMEOUT` timeout close socket automatically after inactivity, in seconds, default `60`

#### Http

`ISOMOR_HTTP_BASE_URL` base url of the http server, by default an empty string, so it will use the same base url as the browser.
