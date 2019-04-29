import React from 'react';
import { useAsyncCache } from 'react-async-cache';

import { getSomethingWithError } from './server/data';

const errorStyle = {
  color: 'red',
}

export const ErrorExample2 = () => {
  const { call, response, error } = useAsyncCache();
  React.useEffect(() => {
      call(getSomethingWithError);
  });

  return (
    <div style={errorStyle}>
      {error && <p><b>Some error handling example 2:</b> {error.toString()} </p>}
    </div>
  );
}
