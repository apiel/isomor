import React, { Component } from 'react';
import { Time } from './status/time';
import { TimeUTC } from './status/timeUTC';

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
    </div>
);

export const TwoColumn = () => (
    <div style={styleRow}>
        <Column />
        <Column />
    </div>
)