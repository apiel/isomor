import { User } from './entity/User';
import { getConnection } from 'typeorm';

export { User } from './entity/User';
// or could use interface and class User implements IUser
// export interface IUser {
//     id: number;
//     firstName: string;
//     lastName: string;
//     age: number;
// }

export async function getList(): Promise<User[]> {
    return getConnection().manager.find(User);
}
