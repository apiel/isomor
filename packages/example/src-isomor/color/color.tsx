import React from 'react';
import { useIsomor } from 'isomor-react';
import { getColor, setColor } from './server/color';

export const Color = () => {
    const { call, response: color, update } = useIsomor();
    const load = () => {
      call(getColor);
    }
    React.useEffect(() => { load(); }, []);
    const onClickColor = (newColor: string) => async () => {
        console.log('click color', newColor);
        await setColor(newColor);
        update(newColor, getColor);
    }
    return (
        <div style={{ color }}>
            <b>{ color }</b> Choose a color &nbsp;
            <button onClick={onClickColor('blue')}>blue</button>
            <button onClick={onClickColor('red')}>red</button>
            <button onClick={onClickColor('green')}>green</button>
            <button onClick={onClickColor('pink')}>pink</button>
        </div>
    );
}