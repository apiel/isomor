import React from 'react';
import { styleCard } from '../styleCard';
import { getCount, increment } from './server/count';

export const Count: React.FC = () => {
    const [count, setCount] = React.useState<string>('loading...');
    const load = async () => {
        setCount(await getCount());
    }
    React.useEffect(() => { load(); }, []);
    const onClick = async () => {
        const newValue = await increment();
        setCount(newValue);
    }
    return (
        <div style={styleCard}>
            <button onClick={onClick}> + </button> { count }
        </div>
    );
}