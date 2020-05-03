import { User } from './entity/User';
import { getConnection } from 'typeorm';

export { User } from './entity/User';

export default async function(a?: string, b?: number): Promise<User[]> {
    return getConnection().manager.find(User);
}
