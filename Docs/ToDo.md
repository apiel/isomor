### ToDo

- give more info about how it work

- we could put in travis npx isomor...

- start to build some pkg...

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

