import React, { useState } from 'react';
import { useIsomor } from '../Isomor';
import { getColor } from './server/getColor';

export const Color = () => {
    const { call, response: color } = useIsomor();
    const load = () => {
      call(getColor);
    }
    React.useEffect(() => { load(); }, []);
    return (
        <div style={{ color }}>
            <b>{ color }</b> Choose a color &nbsp;
            <button>blue</button>
            <button>red</button>
            <button>green</button>
            <button>pink</button>
        </div>
    );
}