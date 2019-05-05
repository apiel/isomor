import { createConnection, getConnection } from 'typeorm';
import { User } from './User';
export { User } from './User';

createConnection().then(async conn => {
    // console.log('Cleanup user table.');
    // await conn.manager.clear(User);

    // console.log('Inserting a new user into the database...');
    // const user = new User();
    // user.firstName = 'Alexandre';
    // user.lastName = 'Piel';
    // user.age = 33;
    // await conn.manager.save(user);

    // const user2 = new User();
    // user2.firstName = 'Edith';
    // user2.lastName = 'Piaf';
    // user2.age = 59;
    // await conn.manager.save(user2);
    // console.log(`Saved a new user with id: ${user2.id}`);
}).catch(error => console.error(error));

export const db = () => getConnection();
