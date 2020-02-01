## WebSocket

Since the version 2, isomor support WebSocket as transportation protocol. Using WebSocket can improve the latency to load data, but you would loose the caching feature from HTTP. To use the WebSocket with isomor, you need to activate it with the [environment variable](Docs/Config.md) `ISOMOR_WS`. As value, provide a regular expression matching all the function names that need to use the WebSocket protocol:

- to only use WS, then provide the following regex `.*`
- to use it with all the function starting by `hello`, then provide `hello.*`
- and so on...

### Context

As for the [HTTP context](Docs/ReqResCtx.md), you can also access the context from the WebSocket containing the incoming request message and the socket instance:

```
export interface WsContext {
    req: IncomingMessage;
    ws: WebSocket;
}
```

Use this context in the same way you would do for HTTP: [Request / Response context](Docs/ReqResCtx.md)

### React

In order to be able to use WebSocket in dev mode, you need to update the proxy settings. First, remove the proxy parameter from `package.json`. Then, install `http-proxy-middleware` using Yarn:

```shell
yarn add http-proxy-middleware
```

Finally, create **src-isomor/setupProxy.js** and place the following contents in it:

```js
const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/isomor',
        proxy({ target: 'http://127.0.0.1:3005', ws:true })
    );
};
```

For more details, [see React documentation](https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually).
