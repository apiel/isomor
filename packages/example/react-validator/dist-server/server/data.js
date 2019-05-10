"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
class Input {
}
__decorate([
    class_validator_1.Length(2, 20),
    __metadata("design:type", String)
], Input.prototype, "name", void 0);
__decorate([
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], Input.prototype, "email", void 0);
exports.Input = Input;
function setUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = Object.assign(new Input(), input);
        const errors = yield class_validator_1.validate(user);
        if (errors.length) {
            return `Validation failed ${JSON.stringify(errors, null, 4)}`;
        }
        return `Validation success for:
    - name: ${user.name}
    - email: ${user.email}

Server uptime is ${process.uptime()}`;
    });
}
exports.setUser = setUser;
