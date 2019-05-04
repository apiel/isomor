
export interface ServerTimeUTC {
    time: string,
}

export async function getTimeUTC(): Promise<ServerTimeUTC> {
    return { time: (new Date()).toLocaleString() };
}