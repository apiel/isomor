import React from 'react';

import { validate } from 'class-validator';
import setUser from 'api/setUser';
// Usually, you should not import file from the api/server folder
// But in some special case, you might have to share code between the client and the server
// In this case, be cautious about the library imported in those files
import { UserInput } from 'api/server/validation/UserInput';

export const Form = () => {
    const [clientErrors, setClientErrors] = React.useState<string>('');
    const [result, setResult] = React.useState<string>('');
    const [input, setInput] = React.useState<UserInput>(new UserInput());
    const send = async () => {
        setResult(await setUser(input));
    };
    const onChangeInput = (key: 'name' | 'email') => async ({
        target: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
        input[key] = value;
        const errors = await validate(input);
        setClientErrors(JSON.stringify(errors, null, 4));
        setInput(input);
    };

    return (
        <div>
            <p>
                Name: <input onChange={onChangeInput('name')} />
            </p>
            <p>
                Email: <input onChange={onChangeInput('email')} />
            </p>
            <button onClick={send}>Server validation</button>
            {result && (
                <>
                    <p>
                        <b>Server result:</b>
                    </p>
                    <pre>{result}</pre>
                </>
            )}
            {clientErrors && (
                <>
                    <p>
                        <b>Client validation:</b>
                    </p>
                    <pre>{clientErrors}</pre>
                </>
            )}
        </div>
    );
};
