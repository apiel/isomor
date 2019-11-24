import React from 'react';
import { getColor, setColor } from './server/color';

export const Color = () => {
    const [color, setStateColor] = React.useState<string>();

    React.useEffect(() => { getColor().then(setStateColor); }, []);
    const onClickColor = (newColor: string) => async () => {
        console.log('click color', newColor);
        await setColor(newColor);
        setStateColor(newColor);
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
