import { User } from './entity/User';
import { getConnection } from 'typeorm';

export { User } from './entity/User';

export async function getList(): Promise<User[]> {
    return getConnection().manager.find(User);
}
