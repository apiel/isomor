import { getCpuAndMem, } from './os/getCpuAndMem';

// import { CpuInfo } from 'os';

export interface CpuInfo{ // need to fix just import should be enough
    model: string;
    speed: number;
}

export interface Status {
    uptime: number,
    cpus: CpuInfo[],
    totalmem: number,
    freemem: number,
}

export async function getStatus(): Promise<Status> {
    return { uptime: process.uptime(), ...getCpuAndMem() };
}