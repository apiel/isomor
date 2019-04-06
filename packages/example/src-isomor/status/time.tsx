import React from 'react';
import { getTime, ServerTime } from './server/getTime';

export const Time = () => {
  const [time, setTime] = React.useState<ServerTime>();
  const load = async () => {
    setTime(await getTime());
  }
  React.useEffect(() => { load(); }, []);
  return (
    <div>
      {!time ? <p>Loading...</p> : (
          <p><b>Server time:</b> {time.time}</p>
      )}
    </div>
  );
}