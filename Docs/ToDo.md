### ToDo

- Doc config file isomor.env
- update vscode ext

- think about to make lib component including isomor frontend and server
    -> need to glob in node_module for isomor file

- look at stdlib.com or lambda function and think about an isomor version just to generate API without frontend.
    -> microservice where server can call another server


- unit test validator
- try to use tsc --watch for the server instead of nodemon


- svelte wait for typescript support -> https://github.com/sveltejs/svelte/issues/1639

- should we generate VALIDATION only manually?

- is isomor-server isomor-transpiler --dev necessary in installer?

- cleanup path => url, json ...
- should we make loadValidation async?

- vscode extension
    - handle delete and move file
    - automatically publish when new isomor-transpiler using ~~asure or travis~~? or manually trigger...

- make a pure Ts/js example without react, vue, ...

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

