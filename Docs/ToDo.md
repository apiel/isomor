### ToDo

- **get access to request**
  - permission -> cookie, JWT
- FIX: travis
- FIX: need to fix server router (react router refresh kaput)
- FIX: transpiler file does not always get copy
- transpiler: we should transform every type to any in interface > see test

- need e2e test before publish
- integration test? for file structure after transpiling

- isomor-react -> error handling
- vuejs example
- angular example


- stop using fancy-log not so fancy -> implement own log lib
  - extend console.log to have default colors

- in isomor-react-app include example
        info('Create empty server/data.ts');
        outputFileSync('server/data.ts'), 'something here');
        // as well in App.tsx



- base on params types of server function generate validation on endpoint
  - https://stackoverflow.com/questions/33800497/check-if-an-object-implements-an-interface-at-runtime-with-typescript
  - https://github.com/pcan/reflec-ts-examples/tree/master/simple-validator

- in transpiler use ts.createSourceFile
  - https://medium.com/@urish/diving-into-the-internals-of-typescript-how-i-built-typewiz-d273bbef3565

- Need to test JS and provide example
- websocket version where server could call frontend functions
- add config file using `cosmiconfig` lib (isomor-core)

- make babel plugin
  - https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#stages-of-babel
  - babel --presets @babel/preset-typescript --plugins module:isomor-babel src-isomor/server/data.ts -o output.ts


tsc:
- https://github.com/mohd-akram/tisk/blob/master/bin.js

Might use `ts.createSourceFile` in transpiler
  - in transpiler for traversing the tree and updating it
      - think as well about a watch mode that would work with create-react-app



~~use decorator for isomor-react~~
since decorator are not possible on function maybe use type

```tsx
import React from 'react';
import { getStatus, Status } from './server/getStatus';

type Cache<T = any> = T;

export const Stats = () => {
  const [status, setStatus] = React.useState<Status>();
  const load = async () => {
    setStatus(await getStatus() as Cache<Status>);
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
            {status.cpus && status.cpus.map((cpu, index) => <li key={index}>{cpu.model} {cpu.speed}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}
```
