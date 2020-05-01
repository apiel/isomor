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
const utils_1 = require("./utils");
function useIsomorHttp(app, routes) {
    routes.map(({ urlPath, validationSchema, fn }) => {
        app.use(urlPath, (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ctx = { type: 'http', req, res };
                const args = (req.body && req.body.args) || [];
                utils_1.validateArgs(validationSchema, args);
                const result = yield fn.call(ctx, ...args);
                return res.send({ result });
            }
            catch (error) {
                next(error);
            }
        }));
    });
}
exports.useIsomorHttp = useIsomorHttp;
//# sourceMappingURL=use-isomor-http.js.map