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
const path_1 = require("path");
const isomor_core_1 = require("isomor-core");
function start(options) {
    return __awaiter(this, void 0, void 0, function* () {
        fancy_log_1.info('Starting server.');
        const app = express();
        const port = 3005;
        app.use(bodyParser.json());
        const { distServerFolder } = options;
        const files = yield isomor_core_1.getFiles(distServerFolder);
        files.forEach(file => {
            const functions = require(path_1.join(process.cwd(), file));
            Object.keys(functions).forEach(name => {
                const entrypoint = `/isomor/${path_1.parse(file).name}/${name}`;
                fancy_log_1.info('Create entrypoint:', entrypoint);
                app.use(entrypoint, (req, res) => __awaiter(this, void 0, void 0, function* () {
                    const result = req.body && req.body.args
                        ? yield functions[name](...req.body.args)
                        : yield functions[name]();
                    return res.send(result);
                }));
            });
        });
        app.listen(options.port, () => fancy_log_1.info(`Server listening on port ${port}!`));
    });
}
start({
    distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
});
//# sourceMappingURL=index.js.map