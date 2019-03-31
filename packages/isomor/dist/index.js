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
const axios_1 = require("axios");
function magic(action, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const isServer = process.env.SERVER;
        if (isServer !== undefined) {
            return yield action()(input);
        }
        else {
            console.log('wasist', action.toString());
            const regGetName = (/\)\.(.+);/gim).exec(action.toString());
            if (!regGetName) {
                throw (new Error('Could not get method name to query'));
            }
            else {
                const [none, name] = regGetName;
                const { data } = yield axios_1.default.post(`http://127.0.0.1:3000/${name}`, input);
                return data;
            }
        }
    });
}
exports.magic = magic;
//# sourceMappingURL=index.js.map