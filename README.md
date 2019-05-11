# Isomor

`isomor` give the possibility to develop a web application in a single javascript project by abstracting the layers between frontend and backend.  Instead to implement an API, using REST or graphql, isomor will allow you to call the server functions directly from the UI code, without to think about the communication protocol. Isomor will take care to generate automatically those layers for you. All your code is implemented in the same folder and isomor will automatically separate them in the background by using Babel transpiler. Since your code is tight together, there is much more consistency between backend and frontend, that is one of the big advantage of using isomor, especially with TypeScript. It remove as well lot of overhead and let you focus on implementing features.

See following example:

*./src-isomor/server/uptime.ts - function executed on server*
```ts
export async function getServerUptime(): Promise<number> {
    return process.uptime();
}
```

*./src-isomor/Uptime.tsx - UI components*
```tsx
import React from 'react';
import { getServerUptime } from './server/uptime';

export const Uptime = () => {
    const [uptime, setUptime] = React.useState<number>();
    const call = async () => setUptime(await getServerUptime());
    React.useEffect(() => { call(); }, []);
    return (
        <p><b>Server uptime:</b> { uptime || 'loading...' }</p>
    );
};
```

As you can see, when the component mount, the app is calling directly `getServerUptime` located on the server. During build process, isomor transpile `getServerUptime` to a query function that will call the backend through an http request. Like this, we have very consistent code between backend and server, especially if you are using types.

This tool has been implemented for TypeScript, since types bring lot of value to this concept. It might work with FlowType and JavaScript as well. Since it is minimalistic and very generic, this tool can work with any kind of library, you can find in the repository some examples with React and VueJS.

**[>> Online documentation <<](https://apiel.github.io/isomor/)**

## Example

```bash
git clone https://github.com/apiel/isomor.git
cd packages/examples/react
# or for VueJs
# cd packages/examples/vue
yarn
yarn prod
```
Open http://127.0.0.1:3005/

or in dev mode:

```bash
yarn dev
```

> **Note:** `yarn dev` is using the npm library [run-screen](https://www.npmjs.com/package/run-screen) to start processes in parallel

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

## Getting started with VueJs

> **Note:** `isomor` has been developed with latest version of node and might not work with old version.

`isomor-vue-app` is a tool that will setup automatically a working environment with isomor and vue-cli.

> **Note:** for the moment, only TypeScript is supported.

Run the following command:

```bash
npx isomor-vue-app my-app
# or use env variable MANUAL=true, to manually select the setup settings. Don't forget to select TypeScript
# MANUAL=true npx isomor-vue-app my-app
cd my-app
yarn dev
```

Finish, you are ready to code :-)

> **Note: `src-isomor` folder is where you will be coding** instead of `src`.

`isomor-vue-app` provide as well a little example:

*components/HelloWorld.vue*
```html
<template>
  <p style="color: green">
    <b>Server uptime:</b>
    {{ uptime || 'loading...' }}
  </p>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getServerUptime } from "./server/uptime";

@Component
export default class HelloWorld extends Vue {
  private uptime!: string;

  data() {
    return {
      uptime: null
    };
  }
  async mounted() {
    this.uptime = await getServerUptime();
  }
}
</script>
```

*components/server/uptime.ts*
```ts
export async function getServerUptime(): Promise<string> {
    return process.uptime().toString();
}
```

### Vue async cache

[vue-async-cache](https://github.com/apiel/async-cache/tree/master/packages/vue-async-cache) is a library that will help you to use `isomore` with VueJs. When you are using `isomor` wihtout this library each call to server functions will generate a request. `vue-async-cache` will create a cache and distinct duplicated request. It will also allow you to share the response to a server function between multiple components.

Without cache you would do:

```html
<template>
  <p style="color: green">
    <button @click="load()">load</button>
    <b>Server uptime:</b>
    {{ uptime || 'loading...' }}
  </p>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getServerUptime } from "./server/uptime";

@Component
export default class HelloWorld extends Vue {
  private uptime!: string;

  data() {
    return {
      uptime: null
    };
  }

  async load() {
    this.uptime = await getServerUptime();
  }

  mounted() {
    this.load();
  }
}
</script>
```

Using the cache:

```html
<template>
  <p style="color: green">
    <button @click="load()">load</button>
    <b>Server uptime:</b>
    {{ uptime || 'loading...' }}
  </p>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getServerUptime } from "./server/uptime";
import { useAsyncCacheWatch } from "vue-async-cache";

@Component
export default class HelloWorld extends Vue {
  private cacheWatch = useAsyncCacheWatch(getServerUptime);

  get uptime() {
    return this.cacheWatch.getResponse();
  }

  load() {
    this.cacheWatch.call();
  }

  mounted() {
    this.load();
  }
}
</script>
```

**Without cache**, if you would have this component 2 times in your app, it would make 2 requests when the components mount. When you click the `load` button, only the component where the button is located would be refreshed.
**With the cache**, only 1 request would be sent instead of 2. When you click the `load` button, both component would be refresh.

See full [documentation](https://github.com/apiel/async-cache/tree/master/packages/vue-async-cache)

## Request / Response context

On the server side, it might be necessary to access the request or response object of Express. For example, to use the cookies for authentication or to update the headers of the response. Fortunately, isomor bound the request and response to the server function and make them accessible using `this.req` and `this.res`.

```ts
export async function getAuth(): Promise<string> {
    return this.req.cookies.username;
}

export async function setAuth(): Promise<string> {
    const username = `user-${Math.floor(Math.random()*1000)}`;
    this.res.cookie('username', username);
    return username;
}
```

and with using `Context` interface:

```ts
import { Context } from 'isomor-server';

export async function getAuth(): Promise<string> {
    const { req }: Context = this;
    return req.cookies.username;
}

export async function setAuth(): Promise<string> {
    const username = `user-${Math.floor(Math.random()*1000)}`;

    const { res }: Context = this;
    res.cookie('username', username);
    return username;
}
```

## TypeORM

[TypeORM](https://typeorm.io/) is a data-Mapper ORM for TypeScript. Supports MySQL, PostgreSQL, MariaDB, SQLite, MS SQL Server, Oracle, MongoDB databases.

TypeORM supports both Active Record and Data Mapper patterns, unlike all other JavaScript ORMs currently in existence, which means you can write high quality, loosely coupled, scalable, maintainable applications the most productive way.

Since I really like this library, I wanted to give an example to use it with isomor to show how simple is it to use a database and how concistant is it.

[>> **example here** <<](https://github.com/apiel/isomor/tree/master/packages/example/react-typeorm)

```bash
git clone https://github.com/apiel/isomor.git
cd packages/examples/react-typeorm
yarn
yarn prod
# or yarn dev
```

## Advanced guides

- [Server](./Docs/Server.md)
- [Manual setup](./Docs/Manual-setup.md)
- [Babel](./Docs/Babel.md)