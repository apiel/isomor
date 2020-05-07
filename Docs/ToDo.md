### ToDo

- fix watch mode!!!

- deploy: zeit (server function), heroku, netlify?

- prepare module to be published?

- e2e test with wip, right now e2e test are against publish module. Would be good to test before publish. To do this, we would need to link the transpiler and server yarn link https://classic.yarnpkg.com/en/docs/cli/link/

- json schema generator, multiple file / watch

- Server no need reload, just clear cache
    - in dev mode check last change of file and reload endpoint only

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

- video

- generate client in other languages? python, kotlin, dart, ...