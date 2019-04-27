import React from 'react';
import { useAsyncCache } from 'react-async-cache';

import { getTime } from './server/getTime';

export const Time = () => {
  const { call, response } = useAsyncCache();
  const load = () => {
    call(getTime);
  }
  React.useEffect(() => { load(); }, []);
  return (
    <div>
      {!response ? <p>Loading...</p> : (
        <p><b>Server time:</b> {response.time} <button onClick={load}>reload</button></p>
      )}
    </div>
  );
}