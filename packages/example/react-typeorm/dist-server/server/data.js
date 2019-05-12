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
const User_1 = require("./entity/User");
const typeorm_1 = require("typeorm");
var User_2 = require("./entity/User");
exports.User = User_2.User;
function getList() {
    return __awaiter(this, void 0, void 0, function* () {
        return typeorm_1.getConnection().manager.find(User_1.User);
    });
}
exports.getList = getList;
