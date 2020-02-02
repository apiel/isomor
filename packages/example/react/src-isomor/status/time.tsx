import React from 'react';
import { subscrib, unsubscrib } from 'isomor';

import { getTime, ServerTime } from './server/getTime';

export const Time = () => {
  const [serverTime, setServerTime] = React.useState<ServerTime>();
  const load = async () => {
    setServerTime(await getTime());
  }
  React.useEffect(() => {
    load();
    // if websocket protocol used, let subscrib to update automatically the time
    const key = subscrib(setServerTime);
    return () => {
      // don't forget to unsubscrib when the component unmount
      unsubscrib(key);
    }
  }, []);
  return (
    <div>
      {!serverTime ? <p>Loading...</p> : (
        <p><b>Server time:</b> {serverTime.time} <button onClick={load}>reload</button></p>
      )}
    </div>
  );
}
