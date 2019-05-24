### ToDo

- FIX warning "but never used" in react example

- example web components, stencil js

- update slide base on stencil argumentation

- params checking in endpoint base on types

- improve server, especially error handling

- react + typeORM installer

- refactor transformer and move each in different file
    - rename tranformerImport to transformImport... and so on

- vscode extension
    - handle delete and move file
    - automatically publish when new isomor-transpiler using ~~asure or travis~~? or manually trigger...

- isomor-NG > nest + angular
    - travis
    - should we provide a way to use something else than axios, like HttpClient from angular?
    - should we provide a way to use something else than express, like nest server?
    - maybe later: should as well allow decorator only per method

- review doc
- video
- provide some test-case example, unit test and integration test

- isomor pkg remove dependency to server and transpiler? should it?

- **base on params types of server function generate validation on endpoint**
  - maybe while transpiling
  - or
  - https://stackoverflow.com/questions/33800497/check-if-an-object-implements-an-interface-at-runtime-with-typescript
  - https://github.com/pcan/reflec-ts-examples/tree/master/simple-validator

- isomor-inject
  - it might be possible to do something like isomor without transpiler, just by using dependency injection. Maybe something like that https://www.npmjs.com/package/inversify . The library could easily inject different script depending if it is on the server or on the client. The downside of this would be that you have to change your way of coding, at least for people from react and vuejs.

- test:
  - isomor-server
  - integration, for file structure after transpiling?

- think about https://keepachangelog.com/en/1.0.0/ CHANGELOG.md



- isomor-rendering, pre-rendering caching... out of scope, so maybe not do it!


- ~~FIX: transpiler file does not always get copy~~
  -> ~~after copy, look if the two files are the same, if not copy again~~

- ? isomor-cli > for install react or vue, and maybe some other feature

- Provide all devops around isomor (docker container, docker compose? maybe even deplyoment script?)
