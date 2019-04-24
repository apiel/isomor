import React from 'react';
import { getStatus, Status } from './server/getStatus';
import { CpuInfo } from 'os';

export const Stats = () => {
  const [status, setStatus] = React.useState<Status>();
  const load = async () => {
    setStatus(await getStatus());
  }
  React.useEffect(() => { load(); }, []);
  return (
    <div>
      {!status ? <p>Loading...</p> : (
        <>
          <p><b>Server uptime:</b> {status.uptime}</p>
          <p><b>Memory:</b> {status.freemem} available of {status.totalmem}</p>
          <p><b>Cpus:</b></p>
          <ul>
            {status.cpus && status.cpus.map((cpu: CpuInfo, index: number) => <li key={index}>{cpu.model} {cpu.speed}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}