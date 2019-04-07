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
const isomor_core_1 = require("isomor-core");
const path_1 = require("path");
function useIsomor(app, distServerFolder, serverFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield isomor_core_1.getFiles(distServerFolder, serverFolder);
        return files.map(file => {
            const filepath = require.resolve(path_1.join(distServerFolder, file), { paths: [process.cwd()] });
            delete require.cache[filepath];
            const functions = require(filepath);
            return Object.keys(functions).map(name => {
                const entrypoint = `/isomor/${isomor_core_1.getPathForUrl(file)}/${name}`;
                app.use(entrypoint, (req, res) => __awaiter(this, void 0, void 0, function* () {
                    const result = req.body && req.body.args
                        ? yield functions[name](...req.body.args)
                        : yield functions[name]();
                    return res.send(result);
                }));
                return entrypoint;
            });
        }).flat();
    });
}
exports.useIsomor = useIsomor;
//# sourceMappingURL=index.js.map