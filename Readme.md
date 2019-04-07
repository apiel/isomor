
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
    return (
      <ul>
        { this.state.list.map((item, index) => <li key={index}>{item}</li>) }
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

### Checkout example

```bash
git clone https://github.com/apiel/isomor.git
cd packages/examples/
yarn
yarn serv

yarn isomor:build
yarn start
```

### How to setup Isomor

The following instruction will explain you how to setup a working enviroment with React and TypeScript.

> **Note:** find an example in the repo  `packages/examples/src-isomor/App.tsx`. It might be possible that some information was not correctly updated in the doc. Please, refer to the example if it happen and open an issue to report.

So let's create a react app with `create-react-app`:

```bash
npx create-react-app my-app --typescript
cd my-app
```

Then add `isomor` library:

```bash
yarn add isomor
```

In `my-app` folder create a copy of `src` called `src-isomor`, **this folder will be where you are coding**.

```bash
cp -r src src-isomor
```

In `src-isomor` add a folder `server`. This folder will be all server side files. All this files will be transpiled to be usable from the client.

> **Note:** you can have multiple `server` folder in your project. The transpiler will transpile each of them but only their root. `server` folder can contain subfolder, but they should not be directly linked to the app. The files imported by the app should always be files from the root of `server` folder. Other subfolder, will be ignored and only used on server side.

```bash
cd src-isomor
mkdir server
```

Now, let's update `package.json` to add some script and a proxy:

```json
  ...
  "proxy": "http://127.0.0.1:3005",
  ...
  "scripts": {
    "isomor:build": "isomor-transpiler",
    "isomor:serv": "isomor-server",
    "build:server": "rimraf ./dist-server && tsc -p tsconfig.server.json",
    "serv": "yarn build:server && yarn isomor:serv",
    ...
```

> **Note:** if you don't want to use type, you need to prefix `isomor-transpiler` with `WITH_TYPES=false`.

As you can see, `build:server` need a custom tsconfig file. This is because, we need to transpile TypeScript in different way depending if it's running on backend or frontend. Create a new file `tsconfig.server.json` with the following content:

```json
{
  "compilerOptions": {
    "types": [
      "node"
    ],
    "module": "commonjs",
    "declaration": false,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es6",
    "sourceMap": false,
    "outDir": "./dist-server",
    "baseUrl": "./"
  },
  "exclude": [
    "node_modules",
    "src",
    "src-isomor/!**/server"
  ],
  "include": [
    "src-isomor/**/server"
  ]
}
```
> **Note:** it's important to keep `"sourceMap": false,` and `"declaration": false,`.

Now we have our working environment. Let's try out with adding a file `data.ts` in the server folder `src-isomor/server`:

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

And that's all, open your browser and access the app with the url http://127.0.0.1:3000/

#### Run in production

```bash
yarn isomor:build
yarn build
STATIC_FOLDER=./build yarn serv
```

Open http://127.0.0.1:3005/

> **Note:** it would be better to use nginx to serv static files

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

### Custom server

Since `isomor` is using expressJs, you could integrate it to your existing api. Just import `useIsomor` from `isomor-server`:

```typescript
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { useIsomor } from 'isomor-server';

const distServerFolder = './dist-server';
const serverFolder = '/server';

(async function() {
    const app = express();

    app.use(bodyParser.json());
    const endpoints = await useIsomor(app, distServerFolder, serverFolder);
    console.log('Created endpoints:', endpoints);

    app.listen(3005, () => console.log(`Server listening on port 3005!`));
})();
```

> **Note:** you need `bodyParser`

### Babel

> WIP

`isomor-transpiler` is using [@babel/generator](https://babeljs.io/docs/en/next/babel-generator.html) to transform the code. Therefor, I created as well a babel plugin [isomor-babel](https://www.npmjs.com/package/isomor-babel) in order to use directly babel instead of the transpiler. But I still didn't had time to find the right setting, since only some files should be transpiled... Also create-react-app does not support babel plugin but only macro. Unfortunately macro seem to have too limited feature to achieve transpiling for `isomor`. Of course, it is always possible to eject create-react-app. When babel is fully working, I might provide a custom version of create-react-app for `isomor`.

---

#### ToDo

- create a custom create-react-app including isomor
- Need to test JS and provide example
- websocket version where server could call frontend functions
- add config file using `cosmiconfig` lib (isomor-core)
- unit test
- hot-reloading

- make babel plugin
  - https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md#stages-of-babel

need to Fix:
// export { CpuInfo } from 'os'; // this is deleted so cant use it in interface. Need to fix

- watch mode:
 https://www.npmjs.com/package/chokidar

Notes:
babel --presets @babel/preset-typescript --plugins isomor-babel src-isomor/server/data.ts -o output.ts
