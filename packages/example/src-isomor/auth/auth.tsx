import React from 'react';
import { getAuth, setAuth } from './server/auth';

const authStyle = {
    fontSize: 12,
    color: '#DDD',
}

export const Auth = () => {
    const [username, setUsername] = React.useState<string>();
    const load = async () => {
        setUsername(await getAuth());
    }
    React.useEffect(() => { load(); }, []);
    const onLogin = async () => {
        setUsername(await setAuth());
    };
    return (
        <span style={authStyle}>
            {username || <a onClick={onLogin} href="#">Click to login</a>}
        </span>
    );
}