"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const api_service_1 = require("./api.service");
const uptime_module_1 = require("./data/uptime/uptime.module");
let ApiModule = class ApiModule {
};
ApiModule = __decorate([
    common_1.Module({
        providers: [api_service_1.ApiService],
        imports: [uptime_module_1.UptimeModule],
    })
], ApiModule);
exports.ApiModule = ApiModule;
