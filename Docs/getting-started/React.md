## Getting started with React

`isomor-react-app` is a tool to create a react application using `create-react-app`, with all additional setup requiered for isomor.

> **Note:** for the moment, only TypeScript is supported.

Run the following command:

```bash
npx isomor-react-app my-app
cd my-app
yarn dev
```

Finish, you are ready to code :-)

> **Note: `src-isomor` folder is where you will be coding** instead of `src`.

### Start coding

Now we have our working environment, let's try out with adding a file `data.ts` in the server folder `src-isomor/server`:

```typescript
import { readdir } from 'fs-extra';

export interface GetListInput {
    foo: string;
}

export async function getList(input: GetListInput): Promise<string[]> {
    const files = await readdir('./');
    return files.map(file => `${file}-${input.foo}-${Math.random()}`);
}
```
Don't forget to add the library `fs-extra` to your `node_modules`:

```bash
yarn add fs-extra
yarn add @types/fs-extra --dev
```

Now let's call `getList` in the app. Open `src-isomor/App.tsx` and add the following code:

```tsx
import React from 'react';
import './App.css';

import { getList, GetListInput } from './server/data';

const App = () => {
  const [list, setList] = React.useState<string[]>([]);
  const load = async () => {
    const input: GetListInput = { foo: 'magic' };
    setList(await getList(input));
  }
  React.useEffect(() => { load(); }, []);
  return (
    <div className="App">
      <header className="App-header">
        Isomor
      </header>
      <ul>
        {
          list.map((item, index) => <li key={index}>{item}</li>)
        }
      </ul>
      <button onClick={load}>load again</button>
    </div>
  );
}

export default App;
```
Here we are using hook instead of class component but you can find an example in the repo  `packages/examples/react/src-isomor/App.tsx` using class.

Ok, now we have everything, normally we should now be able to transpile and start.

First let's run the server:

```bash
yarn serv
```

You should get something like:

```bash
[19:55:35] Starting server.
[19:55:35] Created endpoints: [ '/isomor/server-data/getList' ]
[19:55:35] Server listening on port 3005!
```

The server is running on port `3005` and previously we setup a proxy in `package.json` to this port (for dev purpose only).

Now let's start the app:

```bash
yarn isomor:build
yarn start
```

### React async cache

[react-async-cache](https://github.com/apiel/async-cache/tree/master/packages/react-async-cache) is a library that will help you to use `isomore` with react. When you are using `isomor` wihtout this library each call to server functions will generate a request. `react-async-cache` will create a cache and distinct duplicated request. It will also allow you to share the response to a server function between multiple components.

Without cache you would do:

```jsx
import { getTime } from './server/getTime';

export const Time = () => {
  const [time, setTime] = React.useState<string>();
  const load = async () => {
      setTime(await getTime());
  }
  React.useEffect(() => { load(); }, []);
  return (
    <div>
      {!time ? <p>Loading...</p> : (
        <p><b>Server time:</b> {time} <button onClick={load}>reload</button></p>
      )}
    </div>
  );
}
```

Using the cache:

```jsx
import React from 'react';
import { useAsyncCacheEffect } from 'react-async-cache';

import { getTime } from './server/getTime';

export const Time = () => {
  const { call, response } = useAsyncCacheEffect(getTime);
  return (
    <div>
      {!response ? <p>Loading...</p> : (
        <p><b>Server time:</b> {response.time} <button onClick={call}>reload</button></p>
      )}
    </div>
  );
}
```

**Without cache**, if you would have this component 2 times in your app, it would make 2 requests when the components mount. When you click the `load` button, only the component where the button is located would be refreshed.
**With the cache**, only 1 request would be sent instead of 2. When you click the `load` button, both component would be refresh.


`react-async-cache` has also a mecanism to update the cache, so you don't have to refetch data.

```jsx
import React from 'react';
import { useAsyncCacheWatch } from 'react-async-cache';

import { getTime } from './server/getTime';
import { setTime } from './server/setTime';

export const Time = () => {
  const { call, response, update } = useAsyncCacheWatch(getTime);
  React.useEffect(() => { call(); }, []);
  const onClickUpdate = () => async () => {
    const newTime = await setTime('08:00');
    update(newTime);
  }
  return (
    <div>
      {!response ? <p>Loading...</p> : (
        <p>
          <b>Server time:</b> {response.time}
          <button onClick={call}>reload</button>
          <button onClickUpdate={onClickUpdate}>update</button>
        </p>
      )}
    </div>
  );
}
```

When you click the button `update`, the update request is sent to the server, when the response is received, the cache is updated and the 2 components get updated.

See full [documentation](https://github.com/apiel/async-cache/tree/master/packages/react-async-cache)
