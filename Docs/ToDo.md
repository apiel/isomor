### ToDo

- npx isomor (should rename isomor to isomor-lib ?)
- yarn <> npm
- fix angular issue
- swagger add params? and format?
    - might validate endpoint using swagger?
- isomor-transpiler isomor-server --dev necessary in installer

- look at stdlib.com or lambda function and think about an isomor version just to generate API without frontend.

- unit test validator

- cleanup path => url, json ...
- should we make loadValidation async?
- try to use tsc --watch for the server instead of nodemon
- might need to move stuff in isomor-core instead to load transpiler and server between each other

- vscode extension
    - handle delete and move file
    - automatically publish when new isomor-transpiler using ~~asure or travis~~? or manually trigger...

- make a pure Ts/js example without react, vue, ...

- improve server
    - test
    - doc: available methods for api doc, useIsomor...

- isomor-NG > nest + angular
    - travis
    - should we provide a way to use something else than axios, like HttpClient from angular?
    - should we provide a way to use something else than express, like nest server?
    - maybe later: should as well allow decorator only per method

- review doc
    - explain how isomor work in details: transpiler, server
    - explain why to use babel instead of ts.createProgram
- video
- provide some test-case example, unit test and integration test

- example web components, stencil js: stencil is still not stable

- **base on params types of server function generate validation on endpoint**
  - https://www.npmjs.com/package/ts-json-schema-generator
  - https://www.npmjs.com/package/typescript-json-schema
  - the problem is those library use tsc and it is very slow to bootstrap since tsc need to load all dependency unlike babel (this is also why we should prefer using babel instead of tsc for transpiler)
  - to use this library, we would have to build the json schema in a separate process/task in parallel of transpiling
  - other option would be to implement similar lib with babel (too much work!)

- isomor-inject
  - it might be possible to do something like isomor without transpiler, just by using dependency injection. Maybe something like that https://www.npmjs.com/package/inversify . The library could easily inject different script depending if it is on the server or on the client. The downside of this would be that you have to change your way of coding, at least for people from react and vuejs.

- think about https://keepachangelog.com/en/1.0.0/ CHANGELOG.md



- isomor-rendering, pre-rendering caching... out of scope, so maybe not do it!





- to fix
ERR { Error: Command failed: isomor-json-schema-generator --path src-isomor/server/api.service.ts --type ApiService.test
home/alex/dev/node/test/my-app/node_modules/@types/selenium-webdriver/http.d.ts(24,14): error TS2583: Cannot find name 'Map'. Do you need to change your target library? Try changing the `lib` compiler option to es2015 or later.
home/alex/dev/node/test/my-app/node_modules/@types/selenium-webdriver/http.d.ts(48,14): error TS2583: Cannot find name 'Map'. Do you need to change your target library? Try changing the `lib` compiler option to es2015 or later.
home/alex/dev/node/test/my-app/node_modules/@types/selenium-webdriver/remote.d.ts(139,29): error TS2583: Cannot find name 'Map'. Do you need to change your target library? Try changing the `lib` compiler option to es2015 or later.
home/alex/dev/node/test/my-app/node_modules/rxjs/internal/Observable.d.ts(89,59): error TS2585: 'Promise' only refers to a type, but is being used as a value here. Do you need to change your target library? Try changing the `lib` compiler option to es2015 or later.

    at ChildProcess.exithandler (child_process.js:297:12)
    at ChildProcess.emit (events.js:197:13)
    at maybeClose (internal/child_process.js:984:16)
    at Process.ChildProcess._handle.onexit (internal/child_process.js:265:5)
  killed: false,
  code: 1,
  signal: null,
  cmd:
   'isomor-json-schema-generator --path src-isomor/server/api.service.ts --type ApiService.test' }
• warn home/alex/dev/node/test/my-app/node_modules/@types/selenium-webdriver/http.d.ts(24,14): error TS2583: Cannot find name 'Map'. Do you need to change your target library? Try changing the `lib` compiler option to es2015 or later.
home/alex/dev/node/test/my-app/node_modules/@types/selenium-webdriver/http.d.ts(48,14): error TS2583: Cannot find name 'Map'. Do you need to change your target library? Try changing the `lib` compiler option to es2015 or later.
home/alex/dev/node/test/my-app/node_modules/@types/selenium-webdriver/remote.d.ts(139,29): error TS2583: Cannot find name 'Map'. Do you need to change your target library? Try changing the `lib` compiler option to es2015 or later.
home/alex/dev/node/test/my-app/node_modules/rxjs/internal/Observable.d.ts(89,59): error TS2585: 'Promise' only refers to a type, but is being used as a value here. Do you need to change your target library? Try changing the `lib` compiler option to es2015 or later.

(node:10297) UnhandledPromiseRejectionWarning: SyntaxError: Unexpected end of JSON input
    at JSON.parse (<anonymous>)
    at /home/alex/dev/node/test/my-app/node_modules/isomor-transpiler/dist/validation.js:66:30
    at Generator.next (<anonymous>)
    at /home/alex/dev/node/test/my-app/node_modules/isomor-transpiler/dist/validation.js:7:71
    at new Promise (<anonymous>)
    at __awaiter (/home/alex/dev/node/test/my-app/node_modules/isomor-transpiler/dist/validation.js:3:12)
    at child_process_1.exec (/home/alex/dev/node/test/my-app/node_modules/isomor-transpiler/dist/validation.js:55:74)
    at ChildProcess.exithandler (child_process.js:304:5)
    at ChildProcess.emit (events.js:197:13)
    at maybeClose (internal/child_process.js:984:16)
(node:10297) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:10297) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.


