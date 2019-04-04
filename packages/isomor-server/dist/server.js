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
const _1 = require(".");
function start(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { distServerFolder, port } = options;
        fancy_log_1.info('Starting server.');
        const app = express();
        app.use(bodyParser.json());
        const endpoints = yield _1.useIsomor(app, distServerFolder);
        fancy_log_1.info('Created endpoints:', endpoints);
        app.listen(port, () => fancy_log_1.info(`Server listening on port ${port}!`));
    });
}
start({
    distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
});
//# sourceMappingURL=server.js.map