## WebSocket

Since the version 2, isomor support WebSocket as transportation protocol. Using WebSocket can improve the latency to load data, but you would loose the caching feature from HTTP. To use WebSocket with isomor, you need to activate it with the [environment variable](Docs/Config.md) `ISOMOR_WS`. As value, provide a regular expression matching all the files names (without the extension) that need to use the WebSocket protocol:

- to only use WS, then provide the following regex `.*`
- to use it with all the file starting by `ws`, then provide `ws.*`
- and so on...

> **Note:** websocket get automatically close after 60 seconds of inactivity. You can change this timeout with an [environment variable](Docs/Config.md) `ISOMOR_WS_TIMEOUT`. To deactivate it, set the value to `0`.

### Context

As for the [HTTP context](Docs/ReqResCtx.md), you can also access the context from the WebSocket containing the incoming request message and the socket instance:

```ts
export interface WsContext {
    req: IncomingMessage;
    ws: WebSocket;
    push: (payload: any) => Promise<void>;
    setWsConfig: (config: WsConfig) => Promise<void>;
}
```

Use this context in the same way you would do for HTTP: [Request / Response context](Docs/ReqResCtx.md)

### Push

WebSocket provide full-duplex communication, so you can push data from the server to the client. `WsContext` share a `push` function to send data to the server. Example of server function:

```ts
// This function will send the server time every second
export default async function(): Promise<void> {
    const { push }: WsContext = this;
    setInterval(() => push((new Date()).toLocaleString()), 1000);
}
```

On the client, you need to subscribe to the pushed messages sent from the server:

```ts
import React from 'react';
import { subscribe, unsubscribe } from 'isomor';
import pushTime from 'api/pushTime';

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

### Cookies

By default the cookies are not sent over websocket. But you can ask to isomor to send them for each query. There is 3 way to do this.

From the server for every connection with `setWsDefaultConfig`. In the startup script `api/startup/index.ts` add the following:

```ts
import { setWsDefaultConfig } from 'isomor-server';

export default function(app: any) {
    setWsDefaultConfig({ withCookie: true });
}
```

From a server function for a given connection with `setWsConfig` of `WsContext`:

```ts
export async function someFunction(): Promise<string> {
    this.setWsConfig({ withCookie: true });
    return 'something';
}
```

Fron the client, within a component:

```ts
import React from 'react';
import { setWsConfig } from 'isomor';
import setAuth from 'api/setAuth';

export const Auth = () => {
    const onLogin = async () => {
        setWsConfig({ withCookie: true });
        await setAuth();
        setWsConfig({ withCookie: false });
    };
    return (
        <a onClick={onLogin} href="#">Click to login</a>
    );
}
```
