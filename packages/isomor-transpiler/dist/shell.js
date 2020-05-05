"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spawn = require("cross-spawn");
const debug_1 = require("debug");
function shell(command, args, cwd = process.cwd(), env) {
    debug_1.default('isomor-transpiler:shell')(`${command} ${args.join(' ')}`);
    return new Promise((resolve) => {
        var _a, _b;
        const COLUMNS = process.env.COLUMNS || ((_a = process.stdout.columns) === null || _a === void 0 ? void 0 : _a.toString());
        const LINES = process.env.LINES || ((_b = process.stdout.rows) === null || _b === void 0 ? void 0 : _b.toString());
        const cmd = spawn(command, args, {
            cwd,
            env: Object.assign(Object.assign(Object.assign(Object.assign({}, (COLUMNS && { COLUMNS })), (LINES && { LINES })), env), process.env),
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