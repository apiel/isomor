import React from 'react';
import { getTime } from './server/getTime';
import { useIsomor } from '../Isomor';

export const Time = () => {
  const { call, response } = useIsomor();
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