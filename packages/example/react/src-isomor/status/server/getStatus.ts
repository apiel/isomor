import { getCpuAndMem, } from './os/getCpuAndMem';

import { CpuInfo } from 'os';

export interface Status {
    uptime: number,
    cpus: CpuInfo[],
    totalmem: number,
    freemem: number,
}

export async function getStatus(): Promise<Status> {
    return { uptime: process.uptime(), ...getCpuAndMem() };
}
