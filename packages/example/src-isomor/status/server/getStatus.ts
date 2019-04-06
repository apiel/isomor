import { getCpuAndMem, } from './os/getCpuAndMem';

// import { CpuInfo } from 'os'; // this is deleted so cant use it in interface. Need to fix
// export { CpuInfo } from 'os'; // this is deleted so cant use it in interface. Need to fix

export interface Status {
    uptime: number,
    cpus: { model: string, speed: number }[],
    // cpus: CpuInfo[], // need to fix
    totalmem: number,
    freemem: number,
}

export async function getStatus(): Promise<Status> {
    return { uptime: process.uptime(), ...getCpuAndMem() };
}