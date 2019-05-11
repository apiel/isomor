import * as jwt from 'express-jwt';
import * as express from 'express';

import { secret } from './secret';

export default function(app: express.Express) {
    app.use(jwt({
        secret,
        credentialsRequired: false,
        getToken: (req) => req.cookies.token,
    }));
}
