import { HttpContext } from 'isomor-server';

// or use noImplicitThis
export default async function (): Promise<string> {
    const { req }: HttpContext = this;
    return req.cookies.username;
}
