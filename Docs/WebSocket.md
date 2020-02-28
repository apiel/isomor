## WebSocket

Since the version 2, isomor support WebSocket as transportation protocol. Using WebSocket can improve the latency to load data, but you would loose the caching feature from HTTP. To use the WebSocket with isomor, you need to activate it with the [environment variable](Docs/Config.md) `ISOMOR_WS`. As value, provide a regular expression matching all the function names that need to use the WebSocket protocol:

- to only use WS, then provide the following regex `.*`
- to use it with all the function starting by `ws`, then provide `ws.*`
- and so on...

> **Note:** websocket get automatically close after 60 seconds of inactivity. You can change this timeout with an [environment variable](Docs/Config.md) `ISOMOR_WS_TIMEOUT`. To deactivate it, set the value to `0`.

### Context

As for the [HTTP context](Docs/ReqResCtx.md), you can also access the context from the WebSocket containing the incoming request message and the socket instance:

```ts
export interface WsContext {
    req: IncomingMessage;
    ws: WebSocket;
    push: (payload: any) => void;
}
```

Use this context in the same way you would do for HTTP: [Request / Response context](Docs/ReqResCtx.md)

<!-- ### React

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

For more details, [see React documentation](https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually). -->

### Push

WebSocket provide full-duplex communication, so you can push data from the server to the client. `WsContext` share a `push` function to send data to the server. Example of server function:

```ts
// This function will send the server time every second
export async function pushTime(): Promise<void> {
    const { push }: WsContext = this;
    setInterval(() => push((new Date()).toLocaleString()), 1000);
}
```

On the client, you need to subscribe to the pushed messages sent from the server:

```ts
import React from 'react';
import { subscribe, unsubscribe } from 'isomor';
import { pushTime } from './server/time';

export const Time = () => {
  const [serverTime, setServerTime] = React.useState<string>();
  React.useEffect(() => {
    // subscribe to push request and set the received data in the serverTime
    const id = subscribe((payload) => setServerTime(payload));
    // then call pushTime to start the timer
    pushTime();
    return () => {
      // don't forget to unsubscribe when the component unmount
      unsubscribe(id);
    }
  }, []);
  return (
    <div>
      {!serverTime ? <p>Loading...</p> : (
        <p><b>Server time:</b> {serverTime}</p>
      )}
    </div>
  );
}
```
