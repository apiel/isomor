## Request / Response context

On the server, it might be necessary to access the request or response object of Express. For example, to use the cookies for authentication or to update the headers of the response. Fortunately, isomor bound the request and response to the server function and make them accessible using `this.req` and `this.res`.

```ts
export default async function getAuth(): Promise<string> {
    return this.req.cookies.username;
}
```

```ts
export default async function setAuth(): Promise<string> {
    const username = `user-${Math.floor(Math.random()*1000)}`;
    this.res.cookie('username', username);
    return username;
}
```

and with using `HttpContext` interface:

```ts
import { HttpContext } from 'isomor-server';

export async function getAuth(): Promise<string> {
    const { req }: HttpContext = this;
    return req.cookies.username;
}

export async function setAuth(): Promise<string> {
    const username = `user-${Math.floor(Math.random()*1000)}`;

    const { res }: HttpContext = this;
    res.cookie('username', username);
    return username;
}
```
