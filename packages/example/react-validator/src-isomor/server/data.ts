import { Length, IsEmail, validate } from 'class-validator';
import { IsomorShare } from 'isomor';

// instead of this IsomorShare, we should just have a common folder
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
        return `Server validation failed ${JSON.stringify(errors, null, 4)}`;
        // we could as well throw an error
    }
    return `Server validation success for:
    - name: ${user.name}
    - email: ${user.email} \n\nServer uptime is ${process.uptime()}`;
}
