import React from 'react';
import { getSomethingWithError } from './server/data';

const errorStyle = {
  color: 'red',
}

export const ErrorExample = () => {
  const [error, setError] = React.useState<string>();
  const load = async () => {
    try {
      await getSomethingWithError()
    } catch (error) {
      setError(error.toString());
    }
  }
  React.useEffect(() => { load(); }, []);
  return (
    <div style={errorStyle}>
      {error && <p><b>Some error handling example:</b> {error} </p>}
    </div>
  );
}
