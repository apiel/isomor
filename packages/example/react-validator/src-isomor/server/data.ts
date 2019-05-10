import { Length, IsEmail, validate } from 'class-validator';
import { IsomorShare } from 'isomor';

export class Input implements IsomorShare {
    @Length(2, 20)
    name!: string;

    @IsEmail()
    email!: string;
}

export async function setUser(input: Input): Promise<string> {
    const user = Object.assign(new Input(), input)
    const errors = await validate(user);
    if (errors.length) {
        return `Validation failed ${JSON.stringify(errors, null, 4)}`;
        // we could as well throw an error
    }
    return `Validation success for:
    - name: ${user.name}
    - email: ${user.email}

Server uptime is ${process.uptime()}`;
}
