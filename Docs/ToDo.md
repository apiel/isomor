### ToDo

- cleanup deps
- update DOC
    - inform that sub folder should not be called "server"
    - scripts
    - explain how to install
- json schema generator, multiple file / watch
- implement e2e test

- Server no need reload, just clear cache
    - in dev mode check last change of file and reload endpoint only

- generate pkg and focus on api generation instead of react, vue...
    - if fn not async, make it async
    - support ExportDefaultDeclaration

- https://github.com/vega/ts-json-schema-generator
    see if we can use it, instead of custom one

- be able to install typeorm to an exisiting project from cli

- check about how webpack deal with nodejs lib
 + also eslint is complaining about some lib that are imported but not used

- ts transpiler give now much more feature, we should switch away from babel and use ts tools https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
    "Keep in mind that this is not yet a stable API" we might wait to get into a stable version of the API
    before to make any changes.

- implement websocket
    https://github.com/websockets/ws/issues/473
    **think about a caching system**
    + cache only for the current connection (no shared cache)
    + cache only payload that are over 512? length (configurable from env variable, if 0 cache deactivated)
    + if client request the server, the server run the callback function, and before to send the response,
      it look in his cache if there was already an identical response sent. If yes, it only send the md5 of
      this response. The client will then be able to load the response from his cache.
    + as cache msg, we could even skip the JSON format and just return the md5

- use GET method when possible
    + would be great to provide a cache example, with varnish?

- give more info about how it work

- we could put in travis npx isomor...

- update vscode ext
    -> vscode ext should find the isomor-transpiler module

- think about to make lib component including isomor frontend and server
    -> need to glob in node_module for isomor file

- context -> https://www.npmjs.com/package/continuation-local-storage

- unit test validator

- svelte wait for typescript support -> https://github.com/sveltejs/svelte/issues/1639

- should we generate VALIDATION only manually?

- is isomor-server isomor-transpiler --dev necessary in installer?

- cleanup path => url, json ...
- should we make loadValidation async?

- look at stdlib.com or lambda function and think about an isomor version just to generate API without frontend.
    -> microservice where server can call another server
        does it really make sense? why to use microservice?
            -> different stack, isomor is only TS, so doesnt apply
            -> separate concern, all opposite of isomor
            -> to split work on big project, does it really make sense then to have a single project
            -> performance/scaling > this might be the only reason to use it with isomor

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

- isomor-inject
  - it might be possible to do something like isomor without transpiler, just by using dependency injection. Maybe something like that https://www.npmjs.com/package/inversify . The library could easily inject different script depending if it is on the server or on the client. The downside of this would be that you have to change your way of coding, at least for people from react and vuejs.

- think about https://keepachangelog.com/en/1.0.0/ CHANGELOG.md



- isomor-rendering, pre-rendering caching... out of scope, so maybe not do it!

