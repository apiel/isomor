## Request / Response context

On the server side, it might be necessary to access the request or response object of Express. For example, to use the cookies for authentication or to update the headers of the response. Fortunately, isomor bound the request and response to the server function and make them accessible using `this.req` and `this.res`.

```ts
export async function getAuth(): Promise<string> {
    return this.req.cookies.username;
}

export async function setAuth(): Promise<string> {
    const username = `user-${Math.floor(Math.random()*1000)}`;
    this.res.cookie('username', username);
    return username;
}
```

and with using `Context` interface:

```ts
import { Context } from 'isomor-server';

export async function getAuth(): Promise<string> {
    const { req }: Context = this;
    return req.cookies.username;
}

export async function setAuth(): Promise<string> {
    const username = `user-${Math.floor(Math.random()*1000)}`;

    const { res }: Context = this;
    res.cookie('username', username);
    return username;
}
```

Find an example of authentication using JWT [here](https://github.com/apiel/isomor/tree/master/packages/example/react-auth).

> **Note:** isomor pass as well `req` and `res` as last parameter of the function. So you could as well get the request and response like `export async function getAuth(req?: Context.req, res?: Context.res): Promise<string> { ... }`
