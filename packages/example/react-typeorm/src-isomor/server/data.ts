import { db, User } from './entity';

export async function getList(): Promise<User[]> {
    return db().manager.find(User);
}
