#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fancy_log_1 = require("fancy-log");
const express = require("express");
const bodyParser = require("body-parser");
const chokidar_1 = require("chokidar");
const _1 = require(".");
let server;
function start(options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (server) {
            server.close();
        }
        const { distServerFolder, port, staticFolder, serverFolder } = options;
        fancy_log_1.info('Starting server.');
        const app = express();
        app.use(bodyParser.json());
        const endpoints = yield _1.useIsomor(app, distServerFolder, serverFolder);
        fancy_log_1.info('Created endpoints:', endpoints);
        if (staticFolder) {
            fancy_log_1.info('Add static folder', staticFolder);
            app.use(express.static(staticFolder));
        }
        server = app.listen(port, () => fancy_log_1.info(`Server listening on port ${port}!`));
    });
}
function run(options) {
    chokidar_1.watch('file, dir, glob, or array')
        .on('add', path => console.log(`File ${path} has been added`))
        .on('change', path => console.log(`File ${path} has been changed`));
    start(options);
}
start({
    distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
    staticFolder: process.env.STATIC_FOLDER || null,
    serverFolder: process.env.SERVER_FOLDER || '/server',
    watch: process.env.WATCH === 'true',
});
//# sourceMappingURL=server.js.map