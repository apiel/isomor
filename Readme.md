
# Isomor

`Isomor` is a library to create an interface between your backend and your frontend with nodejs and javascript application. Today, fullstack developers often use monorepo to centralize all their architecture inside a single place. This library allow you to do even more. Instead to have different application for backend and frontend, you develop a single "isomorphic" application and `isomor` will take care to split the code and setup a communication protocole. See following example:

```
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

```
import { readdir } from 'fs-extra';
import { GetListInput } from './getList.input';

export async function getList(input: GetListInput): Promise<string[]> {
    const files = await readdir('./');
    return files.map(file => `${file}-${input.foo}-${Math.random()}`);
}
```

As you can see, on `componentDidMount` the app is calling `getList` that is located on the server. But no, **I am not speaking about SSR**. Isomor, is transpiling `getList` to a magic function that will call the backend through an http request. Like this, we have very consistent code between backend and server, especially if you are using types.

Right now I implemented this library for TypeScript, since types bring lot of value to this concept. I didn't tried but it might work as well with FlowType and JavaScript as well. Also, till now I did all my test on React, but it might work with Angular, VueJs and so on.

### How to use it

The following instruction will explain you how to setup a working enviroment with React and TypeScript.

> Note: find an example in the repo  `packages/examples/src-isomor/App.tsx`

So let's create an react app with `create-react-app`:

```
npx create-react-app my-app --typescript
cd my-app
```

Then add `isomor` library:

```
yarn add isomor
```

In `my-app` folder create a copy of `src` called `src-isomor`, **this folder will be where you are coding**.

```
cp -r src src-isomor
```

In `src-isomor` add a folder `server`. This folder will be all server side files. All this files will be transpilled to be usable from the client.

> Note: the transpiler doesn't support subfolder for the moment.

```
cd src-isomor
mkdir server
```

Now, let's update `package.json` to add some script and a proxy:

```
  ....
  "proxy": "http://127.0.0.1:3005",
  ....
  "scripts": {
    "isomor:build": "isomor-transpiler",
    "isomor:serv": "isomor-server",
    "build:server": "rimraf ./dist-server && tsc -p tsconfig.server.json",
    "serv": "yarn build:server && yarn isomor:serv",
    ....
```

> Note: if you don't want to use type, you need to prefix `isomor-transpiler` with `WITH_TYPES=false`.

As you can see, `build:server` need a custom tsconfig file. This is because, we need to transpile TypeScript in different way depending if it's running on backend or frontend. Create a new file `tsconfig.server.json` with the following content:

```
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
    "src-isomor/!server"
  ],
  "include": [
    "src-isomor/server"
  ]
}
```
> Note: it's important to keep `"sourceMap": false,` and `"declaration": false,`.

Now we have our working environment. Let's try out with adding a file `data.ts` in the server folder `src-isomor/server`:

```
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

```
yarn add fs-extra
yarn add @types/fs-extra --dev
```

Now let's call `getList` in the app. Open `src-isomor/App.tsx` and add the following code:

```
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

```
yarn serv
```

You should get something like:

```
[16:51:00] Starting server.
[16:51:00] Create entrypoint: /isomor/data/getList
[16:51:00] Server listening on port 3005!
```

The server is running on port `3005` and previously we setup a proxy in `package.json` to this port (for dev purpose only).

Now let's start the app:

```
yarn isomor:build
yarn start
```

And that's all, open your browser and access the app with the url http://127.0.0.1:3000/

### ToDo

- make server exportable
    - server can be exported by another express instance
    - server should also be able to serv static files from generated js file after `react-create-app build`
- make transpiler work for single file
- Need to test JS and provide example
- create react hook to consume server files
    - hook should also be able to handle cache
- websocket version where server could call frontend functions
- add config file using `cosmiconfig` lib
