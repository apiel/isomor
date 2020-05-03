"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            if (data.toString() !== '\u001bc') {
                process.stdout.write(data.toString());
            }
        });
        cmd.stderr.on('data', (data) => {
            process.stderr.write(data.toString());
        });
        cmd.on('close', (code) => (code ? process.exit(code) : resolve()));
    });
}
exports.shell = shell;
//# sourceMappingURL=shell.js.map