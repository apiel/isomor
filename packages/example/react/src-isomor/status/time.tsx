import React from 'react';
import { useAsyncCacheWatch } from 'react-async-cache';

import { getTime } from './server/getTime';

export const Time = () => {
  // look at timeUTC.tsx using useAsyncCacheEffect taking care of useEffect
  const { call, response } = useAsyncCacheWatch(getTime);
  React.useEffect(() => { call(); }, []);
  return (
    <div>
      {!response ? <p>Loading...</p> : (
        <p><b>Server time:</b> {response.time} <button onClick={call}>reload</button></p>
      )}
    </div>
  );
}