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
const logol_1 = require("logol");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swagger_ui_express_1 = require("swagger-ui-express");
const _1 = require(".");
const path_1 = require("path");
const API_DOCS = '/api-docs';
function start(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { distServerFolder, port, staticFolder, serverFolder } = options;
        logol_1.info('Starting server.');
        const app = express();
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(API_DOCS, swagger_ui_express_1.serve, swagger_ui_express_1.setup(yield _1.getSwaggerDoc(distServerFolder, serverFolder)));
        const endpoints = yield _1.useIsomor(app, distServerFolder, serverFolder);
        logol_1.info('Created endpoints:', endpoints);
        if (staticFolder) {
            logol_1.info('Add static folder', staticFolder);
            app.use(express.static(staticFolder));
            app.get('*', (req, res) => res.sendFile(path_1.join(staticFolder, 'index.html'), {
                root: process.cwd(),
            }));
        }
        app.use((err, req, res, next) => {
            logol_1.error(err);
            res.status(500).send(err.message);
        });
        app.listen(port, () => {
            logol_1.success(`Server listening on port ${port}!`);
            logol_1.info(`Find API documentation at http://127.0.0.1:${port}${API_DOCS}`);
        });
    });
}
start({
    distServerFolder: process.env.DIST_SERVER_FOLDER || './dist-server',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3005,
    staticFolder: process.env.STATIC_FOLDER || null,
    serverFolder: process.env.SERVER_FOLDER || '/server',
});
//# sourceMappingURL=server.js.map