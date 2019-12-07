import React from 'react';
import { getColor, setColor } from './server/color';

const onClickColor = (
    setStateColor: React.Dispatch<React.SetStateAction<string | undefined>>,
    newColor: string,
) => async () => {
    await setColor(newColor);
    setStateColor(newColor);
}

export const Color = () => {
    const [color, setStateColor] = React.useState<string>();

    React.useEffect(() => { getColor().then(setStateColor); }, []);

    return (
        <div style={{ color }}>
            <b>{ color }</b> Choose a color &nbsp;
            <button onClick={onClickColor(setStateColor, 'blue')}>blue</button>
            <button onClick={onClickColor(setStateColor, 'red')}>red</button>
            <button onClick={onClickColor(setStateColor, 'green')}>green</button>
            <button onClick={onClickColor(setStateColor, 'pink')}>pink</button>
        </div>
    );
}
