import React from 'react';
import { getServerUptime } from './server/uptime';

export const Uptime = () => {
    const [uptime, setUptime] = React.useState<number>();
    React.useEffect(() => { getServerUptime().then(setUptime); }, []);
    return (
        <p style={{color: 'yellow'}}><b>Server uptime:</b> { uptime || 'loading...' }</p>
    );
};
