### Shared class

**deprecated need to update doc** but find example there https://github.com/apiel/isomor/blob/master/packages/example/react/src/Form.tsx

In some case, it might be necessary to share common code between backend and frontend. A good example is user input validation. ~~For such use-case, you can use `class` with `IsomorShare` interface implementations. The transpiler will then keep the code as it is, and not transform it.~~

```ts
import { IsomorShare } from 'isomor';

export class Input implements IsomorShare {
    // ...
}
```

> **Note:** Be cautious with `IsomorShare`, the code must be compatible with server and browser.

It is also possible to use decorator `@isomorShare` instead of the interface.

```ts
import { isomorShare } from 'isomor';

@isomorShare
export class Input {
    // ...
}
```

#### Example

The example, will show how to use [class-validator](https://www.npmjs.com/package/class-validator) to validate user input on both side, server and browser.

*src-isomor/server/data.ts*
```ts
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
        return `Server validation failed ${JSON.stringify(errors, null, 4)}`;
        // we could as well throw an error
    }
    return `Server validation success`;
}
```

*src-isomor/App.tsx*
```tsx
import { setUser, Input } from './server/data';
import { validate } from 'class-validator';

export const App = () => {
  const [input, setInput] = React.useState<Input>(new Input());
  const send = async () => {
    const serverValidation = await setUser(input);
    console.log('serverValidation', serverValidation);
  }
  const onChangeInput = (key: 'name' | 'email') => async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    input[key] = value;
    const clientValidation = await validate(input);
    console.log('clientValidation', clientValidation);
    setInput(input);
  }

  return (
    <div>
        <p>Name: <input onChange={onChangeInput('name')} /></p>
        <p>Email: <input onChange={onChangeInput('email')} /></p>
        <button onClick={send}>Server validation</button>
    </div>
  );
}
```

Find full example [here](https://github.com/apiel/isomor/tree/master/packages/example/react-validator).