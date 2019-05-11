import { sign } from 'jsonwebtoken';
import { Input } from '../data';

export const secret = 'secret-to-keep-safe';
export const expiresIn = 20; // sec

export type JsonWebToken = {
    username: string;
};

export function generateToken(user: Input): string {
    const jwt: JsonWebToken = {
        username: user.username,
    };
    return sign(jwt , secret, { expiresIn });
}
