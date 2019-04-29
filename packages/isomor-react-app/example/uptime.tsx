import React from 'react';
import { getServerUptime } from './server/uptime';
// import { useAsyncCacheEffect } from 'react-async-cache';

export const Uptime = () => {
    const [uptime, setUptime] = React.useState<string>();
    const load = async () => setUptime(await getServerUptime());
    React.useEffect(() => { load(); }, []);
    // or instead of the last 3 lines, use react-async-cache
    // const { response: uptime } = useAsyncCacheEffect(getServerUptime);
    return (
        <p style={{color: 'yellow'}}><b>Server uptime:</b> { uptime || 'loading...' }</p>
    );
};
