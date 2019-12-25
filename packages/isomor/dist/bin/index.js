#!/usr/bin/env node
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
const inquirer_1 = require("inquirer");
const child_process_1 = require("child_process");
const chalk = require("chalk");
const REACT = 'React';
const NG = 'Angular + Nest';
const VUE = 'Vue';
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const { framework, name } = yield inquirer_1.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the name of your project:',
                default: () => 'my-app',
            },
            {
                type: 'list',
                name: 'framework',
                message: 'Select which library you want to use?',
                choices: [
                    REACT,
                    VUE,
                    NG,
                ],
            },
        ]);
        if (framework === REACT) {
            yield shell('npx', ['isomor-react-app', name]);
        }
        else if (framework === NG) {
            yield shell('npx', ['isomor-ng-nest', name]);
        }
        else if (framework === VUE) {
            yield shell('npx', ['isomor-vue-app', name]);
        }
        process.exit();
    });
}
function shell(command, args) {
    return new Promise((resolve) => {
        let cmd = child_process_1.spawn(command, args, {
            env: Object.assign({ FORCE_COLOR: 'true', COLUMNS: process.stdout.columns.toString(), LINES: process.stdout.rows.toString() }, process.env),
        });
        cmd.stdout.on('data', data => {
            process.stdout.write(data);
        });
        cmd.stderr.on('data', data => {
            const dataStr = data.toString();
            if (dataStr.indexOf('warning') === 0) {
                process.stdout.write(chalk.yellow('warming') + dataStr.substring(7));
            }
            else {
                process.stdout.write(chalk.red(data.toString()));
            }
        });
        process.stdin.setEncoding('ascii');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => {
            if (key === '\u0003': any) {
                process.exit();
            }
            if (cmd) {
                cmd.stdin.write(key);
            }
        });
        cmd.on('close', () => { cmd = null; resolve(); });
    });
}
start();
//# sourceMappingURL=index.js.map