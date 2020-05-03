import { validate } from 'class-validator';

import { UserInput } from './validation/UserInput';

export default async function(input: UserInput): Promise<string> {
    const user = Object.assign(new UserInput(), input)
    const errors = await validate(user);
    if (errors.length) {
        return `Server validation failed ${JSON.stringify(errors, null, 4)}`;
        // we could as well throw an error
    }
    return `Server validation success for:
    - name: ${user.name}
    - email: ${user.email} \n\nServer uptime is ${process.uptime()}`;
}
