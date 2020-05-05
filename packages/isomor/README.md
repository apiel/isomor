# Isomor

```shell
yarn add isomor
npm install isomor
```

[>> **Online documentation** <<](https://apiel.github.io/isomor/)

`isomor` is a tool to generate the communication between the frontend and the backend. Instead to implement an API, using REST or graphql, isomor will allow you to call the server functions directly from the user interface, without to think about the communication protocol. Isomor will take care to generate automatically those layers for you.

See following example, with a normal client/server architecture, you would do:

_server side_

```ts
// api/uptime.js
export function getServerUptime(req, res) {
  res.send(`${process.uptime()}`);
});

// server.js
import * as express from 'express';
import { getServerUptime } from './api/uptime'

const app = express();

app.get('/api/uptime', getServerUptime);
app.listen(3000, () => console.log(`Example app listening on port 3000!`));
```

_client side_

```jsx
// app.jsx
import React from 'react';
import axios from 'axios';

async function load(setUptime) {
    const { data } = await axios.get('http://127.0.0.1:3000/api/uptime');
    setUptime(data);
}

export const App = () => {
    const [uptime, setUptime] = React.useState < string > 'loading...';
    React.useEffect(() => {
        load(setUptime);
    }, []);
    return <div>Server uptime: {uptime}</div>;
};
```

**Now with isomor it would look like this:**

_./api/getServerUptime.ts - function executed on server_

```ts
export default async function (): Promise<number> {
    return process.uptime();
}
```

_./src/Uptime.tsx - UI components_

```tsx
import React from 'react';
// here we just import the getServerUptime function from the api module
import getServerUptime from 'api/getServerUptime';

export const Uptime = () => {
    const [uptime, setUptime] = React.useState<number>();
    React.useEffect(() => {
        getServerUptime().then(setUptime);
    }, []);
    return (
        <p>
            <b>Server uptime:</b> {uptime || 'loading...'}
        </p>
    );
};
```

As you can see, when the component mount, the app is calling directly `getServerUptime` located on the server. During build process, isomor transpile `getServerUptime` to a query function that will call the backend through an http request.

Since there is no more separation between the backend and the frontend, there is much more consistency and a better overview of the project. It remove lot of overhead and let you focus on implementing features.
It can bring lot of advantage with TypeScript since the types implemented on the server will be the same for the client.
Minimalistic and very generic, this tool can work with any kind of library like React, Vue and Angular or just Vanilla JS.

## How does it work

Isomor work a bit like lambda function. In a specific folder, by default `api`, you define the entrypoints of your server. Those entrypoints must follow some specific rules:

-   all the files in the root of `api` folder are entrypoints
-   each of those file **must** return a default async function

Isomor will then identify those entrypoints and generate an `api` module to consume them.

Finally isomor create a server to expose those entrypoints to the frontend.

That's all :-)

## Getting started

Install isomor:

```shell
yarn add isomor
npm install isomor
```

Update your package.json file to add some script:

```json
  ...
  "scripts": {
    "isomor:build": "isomor-transpiler",
    "isomor:serv": "isomor-server",
    "prod": "yarn isomor:build && yarn build && ISOMOR_STATIC_FOLDER=./build yarn isomor:serv",
    ...
  }
```

Assuming you are using `yarn` and that `yarn build` is building your frontend application in `./build` folder.

`isomor-transpiler` is used to generate your `api` module. During development process you can run it in watch mode like `yarn isomor:build --watch`.

`isomor-server` is used to serve your `api` to be consumed by the frontend. During development process you can run it in watch mode like `yarn isomor:serv --watch`.

Now, in your frontend application, create a folder call `api`. The root of this folder will contain all the entrypoints of your API. Those entrypoints must return a default async function, see following example:

```ts
// in api/getUptime.ts
export default async function (): Promise<number> {
    return process.uptime();
}
```

As you can see, even if we are not using `await`, we are still returning a Promise. This is because the call of the function from the frontend to the backend is asynchrone.
This file can `import` and `export` anything you want from the whole server. Isomor will clean it up and provide the only necessary for the frontend to access the endpoint. So if you export some `type` or `interface`, those will be accessible from the frontend but any exported named function will not.

After creating your first endpoint in api/getUptime.ts file, run `yarn isomor:build` to generate the client. This will create a node module called `api` in "node_modules/api" folder.

In your frontend app, you can now use this module, just like this:

```ts
import getUptime from 'api/getUptime';

getUptime().then((uptime) => document.getElementById('uptime').textContent=`${uptime}`;)
```
And that's all, you are done.

Find some example in the github repo: [https://github.com/apiel/isomor/tree/master/packages/example](https://github.com/apiel/isomor/tree/master/packages/example)

Those 2 examples has been build with React but since an api module is created those could be easily used as well with Vuejs, Angular or...

> **Note:** if you are using this library with react-create-app you might need to setup a server proxy in package.json `"proxy": "http://127.0.0.1:3005",`

> **Note:** the `api` folder should not contain sub folder called `server`.


## Advanced guides

-   [Server](Docs/Server.md)
-   [WebSocket](Docs/WebSocket.md)
-   [Request / Response context](Docs/ReqResCtx.md)
-   [TypeORM](Docs/TypeORM.md)
-   [Config](Docs/Config.md)
-   [Why isomor?!](Docs/Why.md)
