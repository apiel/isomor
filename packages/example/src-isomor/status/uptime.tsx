import React from 'react';
import { getUptime } from './server/getUptime';

export const Uptime = () => {
  const [uptime, setUptime] = React.useState<number>(0);
  const load = async () => {
    setUptime(await getUptime());
  }
  React.useEffect(() => { load(); }, []);
  return (
    <div>
        <b>Uptime:</b> {uptime}
    </div>
  );
}