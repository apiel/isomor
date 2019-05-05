import { createConnection, getConnection } from 'typeorm';
import { User } from './User';
export { User } from './User';

createConnection().then(async conn => {
    console.log('Cleanup user table.');
    await conn.manager.clear(User);

    console.log('Inserting a new user into the database...');
    const user = new User();
    user.firstName = 'Timber';
    user.lastName = 'Martin';
    user.age = 25;
    await conn.manager.save(user);
    console.log(`Saved a new user with id: ${user.id}`);
}).catch(error => console.error(error));

export const db = () => getConnection();
