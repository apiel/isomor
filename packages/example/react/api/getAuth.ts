import { Context } from 'isomor-server';

export default async function (): Promise<string> {
    const { req }: Context = this;
    return req.cookies.username;
}
