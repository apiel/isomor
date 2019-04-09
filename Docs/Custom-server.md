---
title: Custom server
---

[◄ Go back to home page](../Readme.md)

### Custom server

Since `isomor` is using expressJs, you could integrate it to your existing api. Just import `useIsomor` from `isomor-server`:

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

> **Note:** you need `bodyParser`
