import React, { Component } from 'react';
import { Time } from './status/time';
import { TimeUTC } from './status/timeUTC';
import { Color } from './color/color';

const styleRow = {
    display: 'flex',
}

const styleCol = {
    flex: '50%',
    border: '1px solid #DDD',
    margin: 10,
    padding: 10,
}

const Column = () => (
    <div style={styleCol}>
        <Time />
        <TimeUTC />
        <Color />
    </div>
);

export const TwoColumn = () => (
    <div style={styleRow}>
        <Column />
        <Column />
    </div>
)