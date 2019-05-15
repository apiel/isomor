# Isomor

`isomor` give the possibility to develop a web application in a single project by abstracting the layers between frontend and backend.  Instead to implement an API, using REST or graphql, isomor will allow you to call the server functions directly from the UI code, without to think about the communication protocol. Isomor will take care to generate automatically those layers for you. All your code is implemented in the same folder and isomor will automatically separate them by using Babel transpiler. Since your code is tight together, there is much more consistency, that is one of the big advantage of using isomor, especially with TypeScript. It remove as well lot of overhead and let you focus on implementing features.

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

As you can see, when the component mount, the app is calling directly `getServerUptime` located on the server. During build process, isomor transpile `getServerUptime` to a query function that will call the backend through an http request.

This tool has been implemented for TypeScript, since types bring lot of value to this concept. It might work with FlowType and JavaScript as well. Since it is minimalistic and very generic, this tool can work with any kind of library, you can find some examples with React and VueJS in the repository.

[>> **Online documentation** <<](https://apiel.github.io/isomor/)

## Example

```bash
git clone https://github.com/apiel/isomor.git
cd packages/examples/react
# for VueJs
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

Find lot of different example in the folder `packages/examples`, for React, VueJS and as well Angular + NestJs.

## [Getting started with React](Docs/getting-started/React.md)

Click [here](Docs/getting-started/React.md) to see how to use isomor with React.

## [Getting started with Vue](Docs/getting-started/Vue.md)

Click [here](Docs/getting-started/Vue.md) to see how to use isomor with VueJs.

## [Getting started with Angular and NestJs](Docs/getting-started/Angular.md)

Click [here](Docs/getting-started/Angular.md) to see how to use isomor with Angular and NestJs.

## Advanced guides

  * [VScode](Docs/VScode.md)
  * [Request / Response context](Docs/ReqResCtx.md)
  * [Shared class](Docs/Shared-class.md)
  * [TypeORM](Docs/TypeORM.md)
  * [Server](Docs/Server.md)
  * [Babel](Docs/Babel.md)