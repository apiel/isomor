"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const spawn = require("cross-spawn");
const debug_1 = require("debug");
function shell(command, args, cwd = process.cwd(), env) {
    debug_1.default('isomor-transpiler:shell')(`${command} ${args.join(' ')}`);
    return new Promise((resolve) => {
        const cmd = spawn(command, args, {
            cwd,
            env: Object.assign(Object.assign({ COLUMNS: process.env.COLUMNS || process.stdout.columns.toString(), LINES: process.env.LINES || process.stdout.rows.toString() }, env), process.env),
        });
        cmd.stdout.on('data', (data) => {
            process.stdout.write(chalk_1.gray(data.toString()));
        });
        cmd.stderr.on('data', (data) => {
            const dataStr = data.toString();
            if (dataStr.indexOf('warning') === 0) {
                process.stdout.write(chalk_1.yellow('warming') + dataStr.substring(7));
            }
            else {
                process.stdout.write(chalk_1.red(data.toString()));
            }
        });
        cmd.on('close', (code) => (code ? process.exit(code) : resolve()));
    });
}
exports.shell = shell;
//# sourceMappingURL=shell.js.map