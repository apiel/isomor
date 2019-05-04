
export interface ServerTime {
    time: string;
}

export async function getTime(): Promise<ServerTime> {
    return { time: (new Date()).toLocaleString() };
}