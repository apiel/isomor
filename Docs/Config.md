### configuration

The default configuration should be most of the time the right one for implementing an application with isomor. In case you still need to use some custom configuration, you can use environmnet variable. You can either pass the variable directly from the command line or you can use a dotenv file `isomor.env` in the root of your project.

#### Common

`PKG_NAME` is use to define the name of your application/package. This variable is mainly used in the generate API to define the path of the endpoints. If not define, it will take the package name in package.json file.

`DIST_APP_FOLDER` path of the folder after transpiling, default `./src`

`SERVER_FOLDER` path of the folder containing the files executed on the server, default `/server`

`JSON_SCHEMA_FOLDER` destination path where the json schema files are saved for validation of the endpoints, default `./json-schema`

`FILES_PATTERN` file pattern to transpile.

#### Transpiler

`SRC_FOLDER` path of the source folder, by default `./src-isomor`

`NO_VALIDATION` set to `true` to disable json schema validation of the endpoints, default `false`

`NO_TYPES` set to `true` to transform all types to `any` while transpiling, default `false`

`WATCH` set to `true` to have transpiler in watch mode, default `false`

`NO_SERVER_IMPORT` set to `true` to remove all server import, default `false`

`NO_DECORATOR` set to `true` to disable typescript decorator, default `false`

#### Server

`DIST_SERVER_FOLDER` path of the destination folder after server file has been transpiled to JS, default `./dist-server`

`PORT` default `3005`

`STATIC_FOLDER` path to static folder, default `null`

`STARTUP_FILE` path to startup file, default `startup/index.js`,
