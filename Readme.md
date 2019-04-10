---
layout: default
title: Getting started
nav_order: 1
has_children: true
---

# Isomor

`Isomor` is a library to create an interface between your backend and your frontend with nodejs and javascript application. Today, fullstack developers often use monorepo to centralize all their architecture inside a single place. This library allow you to do even more. Instead to have different application for backend and frontend, you develop a single "isomorphic" application and `isomor` will take care to split the code and setup a communication protocole. See following example:

```tsx
class App extends Component {
  state = { list: [] };

  async componentDidMount() {
    const input: GetListInput = { foo: 'magic' };
    const list = await getList(input);
    this.setState({ list });
  }

  render() {
    const { list } = this.state;
    return (
      <ul>
        { list.map((item, index) => <li key={index}>{item}</li>) }
      </ul>
    );
  }
}
```

```typescript
import { readdir } from 'fs-extra';
import { GetListInput } from './getList.input';

export async function getList(input: GetListInput): Promise<string[]> {
    const files = await readdir('./');
    return files.map(file => `${file}-${input.foo}-${Math.random()}`);
}
```

As you can see, on `componentDidMount` the app is calling `getList` located on the server. But no, **I am not speaking about SSR**. Isomor transpile `getList` to a magic function that will call the backend through an http request. Like this, we have very consistent code between backend and server, especially if you are using types.

Right now, this library has been implemented for TypeScript, since types bring lot of value to this concept. It might work with FlowType and JavaScript as well. Also, till now all test has been done on React, but it should work as well with Angular, VueJs and so on.

**[>> Online documentation <<](https://apiel.github.io/isomor/Readme.html)**

## Checkout example

```bash
git clone https://github.com/apiel/isomor.git
cd packages/examples/
yarn
yarn dev
```

> **Notes:** `yarn dev` will run multiple processes in parallel and it will shallow most of the console output. For debugging you might need to run each process manually.

You can also run the project manually and start each process with the following commands:

```bash
yarn serv
yarn isomor:build
yarn start
```

Or in watch mode:

```bash
yarn serv:dev
yarn isomor:build:dev
yarn start
```

Run in production:

```bash
yarn isomor:build
yarn build
STATIC_FOLDER=./build yarn serv
```

Open http://127.0.0.1:3005/

> **Note:** it would be better to use nginx to serv static files

## Getting started with React

> **Note:** `isomor` has been developed with latest version of node and might not work with old version.

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
Here we are using hook instead of class component but you can find an example in the repo  `packages/examples/src-isomor/App.tsx` using class.

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

### Isomor-react

[Isomor-react](https://github.com/apiel/isomor-react) is a library that will help you to use `isomore` with react. When you are using `isomor` wihtout this library each call to server functions will generate a request. `Isomor-react` will create a cache and distinct duplicated request. It will also allow you to share the response to a server function between multiple components.

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
import { useIsomor } from 'isomor-react';

import { getTime } from './server/getTime';

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
```

**Without cache**, if you would have this component 2 times in your app, it would make 2 requests when the components mount. When you click the `load` button, only the component where the button is located would be refreshed.
**With the cache**, only 1 request would be sent instead of 2. When you click the `load` button, both component would be refresh.

Other feature are available like updating the cache... See full [documentation](https://github.com/apiel/isomor-react)

### More

- [Custom server](./Docs/Custom-server.md)
- [Manual setup](./Docs/Manual-setup.md)
- [Babel](./Docs/Babel.md)