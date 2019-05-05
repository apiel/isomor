import { User } from './entity';
import { getConnection } from 'typeorm';

export async function getList(): Promise<User[]> {
    return getConnection().manager.find(User);
}
