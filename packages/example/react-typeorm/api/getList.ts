import { User } from './entity/User';
import { getConnection } from 'typeorm';

export { User } from './entity/User';

export default async function(a?: string, b?: User): Promise<User[]> {
    return getConnection().manager.find(User);
}
