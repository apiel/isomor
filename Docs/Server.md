### server

#### API documentation with Swagger

The server generate automatically the API documentation and make it available using swagger UI at http://localhost:3005/api-docs/

#### API validation

Isomor can validate each incoming request to the server base on the types of the parameters of the function call. To generate the schema validation call the command `yarn isomor:build:validation`.

#### Startup script

The server can call a script when it is starting. Just create a file in `src-isomor/server/startup/index.ts` exporting as default the function to call. The server will call this function at startup, passing as parameter the express server. This can be useful to setup some custom middleware or to simply initialise some library, like an ORM.

*src-isomor/server/startup/index.ts*
```ts
export default function(app: express.Express) {
    // your code...
}
```

#### Custom server

Since `isomor` is using expressJs, it is possible to integrate it to an existing api. Just import `useIsomor` from `isomor-server`:

```typescript
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { useIsomor } from 'isomor-server';

const distServerFolder = './dist-server';
const serverFolder = '/server';

(async function() {
    const app = express();

    app.use(bodyParser.json());
    const endpoints = await useIsomor(app, distServerFolder, serverFolder);
    console.log('Created endpoints:', endpoints);

    app.listen(3005, () => console.log(`Server listening on port 3005!`));
})();
```

> **Note:** don't forget to install `bodyParser` to express
