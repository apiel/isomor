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
const logol_1 = require("logol");
const logger = require("logol");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swagger_ui_express_1 = require("swagger-ui-express");
const morgan = require("morgan");
const isomor_core_1 = require("isomor-core");
const path_1 = require("path");
const startup_1 = require("./startup");
const route_1 = require("./route");
const use_isomor_http_1 = require("./use-isomor-http");
const apidoc_1 = require("./apidoc");
const use_isomor_ws_1 = require("./use-isomor-ws");
const API_DOCS = '/api-docs';
function server({ port, moduleName, staticFolder, wsTimeout, serverFolder, startupFile, jsonSchemaFolder, } = isomor_core_1.getOptions()) {
    return __awaiter(this, void 0, void 0, function* () {
        logol_1.info('Starting server.');
        const app = express();
        app.use(bodyParser.json());
        app.use(cookieParser());
        app.use(morgan('dev', {
            stream: { write: (str) => logol_1.log(str.trim()) },
        }));
        yield startup_1.startup(app, serverFolder, startupFile, logol_1.info);
        const routes = yield route_1.getIsomorRoutes(moduleName, serverFolder, jsonSchemaFolder);
        use_isomor_http_1.useIsomorHttp(app, routes);
        logol_1.info(`Created endpoints:`, routes.map(({ urlPath }) => urlPath));
        app.use(API_DOCS, swagger_ui_express_1.serve, swagger_ui_express_1.setup(apidoc_1.getApiDoc(routes)));
        if (staticFolder) {
            logol_1.info('Add static folder', staticFolder);
            app.use(express.static(staticFolder));
            app.get('*', (req, res) => res.sendFile(path_1.join(staticFolder, 'index.html'), {
                root: process.cwd(),
            }));
        }
        app.use((err, req, res, next) => {
            logol_1.error(err);
            res.status(500).json({ error: err.message });
        });
        const serv = app.listen(port, () => {
            logol_1.success(`Server listening on port ${port}!`);
            logol_1.info(`Find API documentation at http://127.0.0.1:${port}${API_DOCS}`);
        });
        use_isomor_ws_1.useIsomorWs(routes, serv, wsTimeout, logger);
        return { app, server: serv };
    });
}
exports.server = server;
//# sourceMappingURL=server.js.map