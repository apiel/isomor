
export interface ServerUpTime {
    uptime: number,
}

let timer: NodeJS.Timeout;
export default async function (): Promise<ServerUpTime> {
    // if websocket protocol used, push time automatically
    if (this.push) {
        const { push } = this;
        clearInterval(timer);
        timer = setInterval(async () => {
            try {
                await push({ uptime: process.uptime() });
            } catch (error) {
                console.log('Socket not available, stop to push time to client.', error.message);
                clearInterval(timer);
            }
        }, 1000);
    }
    return { uptime: process.uptime() };
}