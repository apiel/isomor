
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
            try {
                await push({ time: (new Date()).toLocaleString() });
            } catch (error) {
                console.log('Socket not available, stop to push time to client.', error);
                clearInterval(timer);
            }
        }, 1000);
    }
    return { time: (new Date()).toLocaleString() };
}