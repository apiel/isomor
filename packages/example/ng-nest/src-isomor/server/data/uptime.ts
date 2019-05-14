import { uptime } from 'os';

export function getUptime() {
    return uptime();
}
