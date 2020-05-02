#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = require('../../package.json');
require('please-upgrade-node')(pkg, {
    message: (v) => `
    ┌────────────────────────────────────────────────────────┐
    │  isomor-server requires at least version ${v} of Node.   │
    │                     Please upgrade.                    │
    └────────────────────────────────────────────────────────┘
    `,
});
const chokidar_1 = require("chokidar");
const isomor_core_1 = require("isomor-core");
const logol_1 = require("logol");
const lib_1 = require("../lib");
const options = isomor_core_1.getOptions();
if (process.argv.includes('--watch')) {
    options.watchMode = true;
}
let watchedServer = null;
let watcherTimer;
if (options.watchMode) {
    watcher();
}
else {
    lib_1.server(options);
}
function watcher() {
    watcherStartServer();
    chokidar_1.watch('.', {
        ignoreInitial: true,
        cwd: options.serverFolder,
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
    })
        .on('ready', () => logol_1.info('Watching for changes...'))
        .on('add', watcherStartServer)
        .on('change', watcherStartServer);
}
function watcherStartServer() {
    clearTimeout(watcherTimer);
    watcherTimer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        if (watchedServer) {
            yield new Promise((resolve) => watchedServer.close(resolve));
        }
        watchedServer = (yield lib_1.server(options)).server;
    }), 50);
}
//# sourceMappingURL=server.js.map