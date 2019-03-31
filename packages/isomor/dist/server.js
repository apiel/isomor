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
const express = require("express");
const bodyParser = require("body-parser");
function server(data) {
    const app = express();
    const port = 3005;
    app.use(bodyParser.json());
    for (const actionKey in data) {
        if (actionKey[0] !== '_') {
            const action = data[actionKey];
            app.use(`/${actionKey}`, (req, res) => __awaiter(this, void 0, void 0, function* () {
                return res.send(yield action(req.body));
            }));
        }
    }
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
exports.server = server;
//# sourceMappingURL=server.js.map