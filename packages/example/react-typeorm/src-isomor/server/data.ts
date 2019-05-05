import { User } from './entity';
import { getConnection } from 'typeorm';

// export { User } from './entity'; // fix transpiler

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
}

export async function getList(): Promise<User[]> {
    return getConnection().manager.find(User);
}
