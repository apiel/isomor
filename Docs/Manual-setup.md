[◄ Go back to home page](../README.md)


### How to setup Isomor manually

The following instruction will explain how to setup a working enviroment with React and TypeScript.

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
    "isomor:build:dev": "nodemon --watch 'src-isomor/**/*' -e ts,tsx --exec 'isomor-transpiler'",
    "serv": "rimraf ./dist-server && tsc -p tsconfig.server.json && isomor-server",
    "serv:dev": "nodemon --watch 'src-isomor/**/server/**/*' -e ts,tsx --exec 'yarn serv'",
    ...
```

> **Note:** if you don't want to use type, you need to prefix `isomor-transpiler` with `NO_TYPES=true`.

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

Now we have our working environment, let's try out: [find some instructions here](../Readme.md#start-coding)
