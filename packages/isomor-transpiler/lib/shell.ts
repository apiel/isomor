import { gray, yellow, red } from 'chalk';
import * as spawn from 'cross-spawn';
import debug from 'debug';

export function shell(
    command: string,
    args?: ReadonlyArray<string>,
    cwd: string = process.cwd(),
    env?: NodeJS.ProcessEnv,
) {
    debug('isomor-transpiler:shell')(`${command} ${args.join(' ')}`);
    return new Promise((resolve) => {
        const cmd = spawn(command, args, {
            cwd,
            env: {
                COLUMNS:
                    process.env.COLUMNS || process.stdout.columns.toString(),
                LINES: process.env.LINES || process.stdout.rows.toString(),
                ...env,
                ...process.env,
            },
        });
        cmd.stdout.on('data', (data) => {
            process.stdout.write(gray(data.toString()));
        });
        cmd.stderr.on('data', (data) => {
            const dataStr = data.toString();
            if (dataStr.indexOf('warning') === 0) {
                process.stdout.write(yellow('warming') + dataStr.substring(7));
            } else {
                process.stdout.write(red(data.toString()));
            }
        });
        cmd.on('close', (code) => (code ? process.exit(code) : resolve()));
    });
}
