import React from 'react';
import { getHello } from './server/data';
import { styleCard } from './styleCard';

export const Hello: React.FC = () => {
    const [hello, setHello] = React.useState<string>('loading...');
    const load = async () => {
        setHello(await getHello());
    }
    React.useEffect(() => { load(); }, []);
    return (
        <div style={styleCard}>
            { hello }
        </div>
    );
}