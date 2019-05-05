import React from 'react';
import { styleCard } from '../styleCard';
import { getCount, increment } from './server/count';
import { Props } from '../props';

export const Count = ({ e2eId }: Props) => {
    const [count, setCount] = React.useState<number>(0);
    const load = async () => {
        setCount(await getCount());
    }
    React.useEffect(() => { load(); }, []);
    const onClick = async () => {
        const newValue = await increment();
        setCount(newValue);
    }
    return (
        <div style={styleCard} data-id={e2eId}>
            <button onClick={onClick}> + </button> { count }
        </div>
    );
}