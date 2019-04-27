import React from 'react';
import { useAsyncCache } from 'react-async-cache';

import { getTimeUTC } from './server/getTimeUTC';

export const TimeUTC = () => {
  const { call, response } = useAsyncCache();
  const load = () => {
    call(getTimeUTC);
  }
  React.useEffect(() => { load(); }, []);
  return (
    <div>
      {!response ? <p>Loading...</p> : (
        <p><b>Server time UTC:</b> {response.time} <button onClick={load}>reload</button></p>
      )}
    </div>
  );
}