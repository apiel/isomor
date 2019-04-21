[◄ Go back to home page](../README.md)

### Babel

> WIP

`isomor-transpiler` is using [@babel/generator](https://babeljs.io/docs/en/next/babel-generator.html) to transform the code. Therefor, I created as well a babel plugin [isomor-babel](https://www.npmjs.com/package/isomor-babel) in order to use directly babel instead of the transpiler. But I still didn't had time to find the right setting, since only some files should be transpiled... Also create-react-app does not support babel plugin but only macro. Unfortunately macro seem to have too limited feature to achieve transpiling for `isomor`. Of course, it is always possible to eject create-react-app. When babel is fully working, I might provide a custom version of create-react-app for `isomor`.
