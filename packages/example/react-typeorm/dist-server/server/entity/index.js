"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
var User_1 = require("./User");
exports.User = User_1.User;
typeorm_1.createConnection().then(() => {
    console.log('Connection was successfully created.');
}).catch(error => console.error(error));
