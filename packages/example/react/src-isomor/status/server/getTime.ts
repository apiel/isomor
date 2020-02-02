
export interface ServerTime {
    time: string,
}

let timer: NodeJS.Timeout;
export async function getTime(): Promise<ServerTime> {
    // if websocket protocol used, push time automatically
    if (this.push) {
        const { push } = this;
        clearInterval(timer);
        timer = setInterval(() => push({ time: (new Date()).toLocaleString() }), 1000);
    }
    return { time: (new Date()).toLocaleString() };
}