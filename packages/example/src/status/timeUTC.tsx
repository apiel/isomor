import React from 'react';
import { useIsomor } from 'isomor-react';

import { getTimeUTC } from './server/getTimeUTC';

export const TimeUTC = () => {
  const { call, response } = useIsomor();
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