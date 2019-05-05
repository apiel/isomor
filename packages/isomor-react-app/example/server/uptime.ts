
export async function getServerUptime(): Promise<number> {
    return process.uptime();
}
