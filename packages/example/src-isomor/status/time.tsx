import React from 'react';
import { getTime, ServerTime } from './server/getTime';
import { useIsomor } from '../Isomor';

export const Time = () => {
  const [time, setTime] = React.useState<ServerTime>();
  const { call, response } = useIsomor();
  const load = async () => {
    call(getTime);
    setTime(await getTime());
  }
  React.useEffect(() => { load(); }, []);
  return (
    <div>
      {!time ? <p>Loading...</p> : (
        <p><b>Server time:</b> {time.time} <button onClick={load}>reload</button></p>
      )}
      <p>JSON: {JSON.stringify(response)}</p>
    </div>
  );
}