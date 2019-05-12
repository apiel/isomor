import 'reflect-metadata';
import * as express from 'express';
import { createConnection } from 'typeorm';

export default async function(app: express.Express) {
    await createConnection();
    console.log('Database connection was successfully created.');
}
