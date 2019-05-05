import 'reflect-metadata';
import {createConnection, Connection} from 'typeorm';
import { User } from './User';

let connection: Connection;

createConnection().then(async conn => {
    connection = conn;

    console.log('Inserting a new user into the database...');
    const user = new User();
    user.firstName = 'Timber';
    user.lastName = 'Saw';
    user.age = 25;
    await conn.manager.save(user);
    console.log(`Saved a new user with id: ${user.id}`);
}).catch(error => console.error(error));

export const db = () => connection;
