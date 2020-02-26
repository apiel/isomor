
export interface ServerTime {
    time: string,
}

let timer: NodeJS.Timeout;
export async function getTime(): Promise<ServerTime> {
    // if websocket protocol used, push time automatically
    if (this.push) {
        const { push } = this;
        clearInterval(timer);
        timer = setInterval(async () => {
            const sent = await push({ time: (new Date()).toLocaleString() });
            if (!sent) {
                console.log('Socket was closed, stop to push time to client.');
                clearInterval(timer);
            }
        }, 1000);
    }
    return { time: (new Date()).toLocaleString() };
}