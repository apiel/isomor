import { db } from './entity';
import { User } from './entity/User';

export async function getList(): Promise<User[]> {
    const users = await db().manager.find(User);
    return users;
}
