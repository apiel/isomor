# Isomor

```bash
npx isomor
```

`isomor` give the possibility to develop a web application in a single project by abstracting the layers between frontend and backend. Instead to implement an API, using REST or graphql, isomor will allow you to call the server functions directly from the user interface, without to think about the communication protocol. Isomor will take care to generate automatically those layers for you.

Since there is no more separation between the backend and the frontend, there is much more consistency and a better overview of the project. It remove lot of overhead and let you focus on implementing features.

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
    React.useEffect(() => { getServerUptime().then(setUptime); }, []);
    return (
        <p><b>Server uptime:</b> { uptime || 'loading...' }</p>
    );
};
```

As you can see, when the component mount, the app is calling directly `getServerUptime` located on the server. During build process, isomor transpile `getServerUptime` to a query function that will call the backend through an http request.

This tool has been implemented for TypeScript, since types bring lot of value to this concept. Minimalistic and very generic, this tool can work with any kind of library, you can find some examples with React, Vue and Angular in the repository.

[>> **Online documentation** <<](https://apiel.github.io/isomor/)

## Getting started

To install isomor with React, Vue or Angular just run the following command:

```bash
npx isomor
```

### [Getting started with React](Docs/getting-started/React.md)

Click [here](Docs/getting-started/React.md) to see how to use isomor with React.

### [Getting started with Vue](Docs/getting-started/Vue.md)

Click [here](Docs/getting-started/Vue.md) to see how to use isomor with VueJs.

### [Getting started with Angular and NestJs](Docs/getting-started/Angular.md)

Click [here](Docs/getting-started/Angular.md) to see how to use isomor with Angular and NestJs.

## Example

```bash
git clone https://github.com/apiel/isomor.git
cd packages/examples/react
# for VueJs
# cd packages/examples/vue
yarn
yarn demo
```
Open http://127.0.0.1:3005/

or in dev mode:

```bash
yarn dev
```

> **Note:** `yarn dev` is running the transpiler, the backend and the frontend in watch mode. It is using the npm library [run-screen](https://www.npmjs.com/package/run-screen) to start those processes in parallel. You can switch from one process to the other by pressing `TAB`

Find examples in the folder `packages/examples`, for React, VueJS and as well Angular + NestJs.

## Advanced guides

  <!-- * [VScode](Docs/VScode.md) -->
  * [Request / Response context](Docs/ReqResCtx.md)
  * [Shared class](Docs/Shared-class.md)
  * [TypeORM](Docs/TypeORM.md)
  * [Server](Docs/Server.md)
  * [Config](Docs/Config.md)
  <!-- * [Babel](Docs/Babel.md) -->