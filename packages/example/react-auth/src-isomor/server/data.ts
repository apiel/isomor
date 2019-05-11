import { generateToken, expiresIn } from "./startup/secret";

export interface Input {
    username: string;
    password: string;
}

export async function setUser(input: Input): Promise<string> {
    const { username, password } = input;
    if (username !== 'demo' && password !== '1234') {
        throw new Error('Bad credential');
    }

    const jwt = await generateToken(input);
    const cookieOptions = {
        maxAge: expiresIn * 1000,
        httpOnly: true,
    };
    this.res.cookie('token', jwt, cookieOptions);

    return username;
}

export async function getUser(): Promise<string> {
    if (this.req.user && this.req.user.username) {
        return this.req.user.username;
    }
}
