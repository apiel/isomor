import { createConnection, getConnection } from 'typeorm';
export { User } from './User';

createConnection().then(() => {
    console.log('Connection was successfully created.');
}).catch(error => console.error(error));
