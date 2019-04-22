import { Context } from 'isomor-server';

export async function getAuth(): Promise<string> {
    const { req }: Context = this;
    return req.cookies.username;
}

export async function setAuth(): Promise<string> {
    const username = `user-${Math.floor(Math.random()*1000)}`;

    const { res }: Context = this;
    res.cookie('username', username, {
        expires: new Date(Date.now() + 5*60*1000), // 5min
        httpOnly: true,
    });
    return username;
}
