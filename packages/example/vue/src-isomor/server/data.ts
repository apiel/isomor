export async function getServerUptime(): Promise<string> {
    return process.uptime().toString();
}
