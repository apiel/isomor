import React from 'react';
import { subscribe, unsubscribe } from 'isomor';

import getUpTime, { ServerUpTime } from 'api/getUpTime';

export const UpTime = () => {
    const [serverTime, setServerTime] = React.useState<ServerUpTime>();
    const load = async () => {
        setServerTime(await getUpTime());
    };
    React.useEffect(() => {
        load();
        // if websocket protocol used, let subscrib to update automatically the time
        const key = subscribe(setServerTime);
        return () => {
            // don't forget to unsubscrib when the component unmount
            unsubscribe(key);
        };
    }, []);
    return (
        <div>
            {!serverTime ? (
                <p>Loading...</p>
            ) : (
                <p>
                    <b>Server uptime:</b> {serverTime.uptime}{' '}
                    <button onClick={load}>reload</button>
                </p>
            )}
        </div>
    );
};
