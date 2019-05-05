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
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
var User_2 = require("./User");
exports.User = User_2.User;
typeorm_1.createConnection().then((conn) => __awaiter(this, void 0, void 0, function* () {
    console.log('Cleanup user table.');
    yield conn.manager.clear(User_1.User);
    console.log('Inserting a new user into the database...');
    const user = new User_1.User();
    user.firstName = 'Timber';
    user.lastName = 'Martin';
    user.age = 25;
    yield conn.manager.save(user);
    console.log(`Saved a new user with id: ${user.id}`);
})).catch(error => console.error(error));
exports.db = () => typeorm_1.getConnection();
