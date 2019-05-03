import React from 'react';
import { useAsyncCacheWatch } from 'react-async-cache';
import { getColor, setColor } from './server/color';
import { styleCard } from '../styleCard';
import { Props } from '../props';

export const Color = ({ e2eId }: Props) => {
    const { load, response: color, update } = useAsyncCacheWatch(getColor);
    React.useEffect(() => { load(); }, []);
    const onClickColor = (newColor: string) => async () => {
        await setColor(newColor);
        update(newColor, getColor);
    }
    return (
        <div style={styleCard} data-id={e2eId}>
            <b style={{ color }}>{color}</b> <button onClick={onClickColor('blue')}> set blue</button>
        </div>
    );
}