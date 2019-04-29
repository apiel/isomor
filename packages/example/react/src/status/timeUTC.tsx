import React from 'react';
import { useAsyncCacheEffect } from 'react-async-cache';

import { getTimeUTC } from './server/getTimeUTC';

export const TimeUTC = () => {
  // this is the same as time.tsx but wrapped inside useAsyncCacheEffect
  const { load, response } = useAsyncCacheEffect(getTimeUTC);
  return (
    <div>
      {!response ? <p>Loading...</p> : (
        <p><b>Server time UTC:</b> {response.time} <button onClick={load}>reload</button></p>
      )}
    </div>
  );
}