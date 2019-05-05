import { User } from './entity';
import { getConnection } from 'typeorm';

export { User } from './entity';
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
