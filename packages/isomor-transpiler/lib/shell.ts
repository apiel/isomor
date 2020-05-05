import { error, log } from 'logol';
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
        const COLUMNS =
            process.env.COLUMNS || process.stdout.columns?.toString();
        const LINES = process.env.LINES || process.stdout.rows?.toString();
        const cmd = spawn(command, args, {
            cwd,
            env: {
                ...(COLUMNS && { COLUMNS }),
                ...(LINES && { LINES }),
                ...env,
                ...process.env,
            },
        });
        cmd.stdout.on('data', (data) => {
            // skip \u001bc -> clear screen
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
