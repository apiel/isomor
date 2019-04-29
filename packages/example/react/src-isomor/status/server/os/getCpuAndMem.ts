import * as os from 'os';

export function getCpuAndMem() {
    return {
        cpus: os.cpus(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
    };
}
