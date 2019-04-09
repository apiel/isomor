[◄ Go back to home page](../Readme.md)

### ToDo

- unit test
- NEED FIX: // export { CpuInfo } from 'os'; // this is deleted so cant use it in interface. Need to fix
- ~~create a custom create-react-app including isomor~~ but need a script to setup environment
- in transpiler use ts.createSourceFile

- need e2e test before publish

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
