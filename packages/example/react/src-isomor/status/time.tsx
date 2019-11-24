import React from 'react';

import { getTime, ServerTime } from './server/getTime';

export const Time = () => {
  const [serverTime, setServerTime] = React.useState<ServerTime>();
  const load = async () => {
    setServerTime(await getTime());
  }
  React.useEffect(() => { load(); }, []);
  return (
    <div>
      {!serverTime ? <p>Loading...</p> : (
        <p><b>Server time:</b> {serverTime.time} <button onClick={load}>reload</button></p>
      )}
    </div>
  );
}