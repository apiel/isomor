// import React from 'react';
// import { useAsyncCacheWatch } from 'react-async-cache';

// import { getSomethingWithError } from './server/data';

// const errorStyle = {
//   color: 'red',
// }

// export const ErrorExample2 = () => {
//   const { load, response, error } = useAsyncCacheWatch(getSomethingWithError);
//   return (
//     <div style={errorStyle}>
//       {error && <p><b>Some error handling example 2:</b> {error.toString()} </p>}
//       <button onClick={load}>Throw another error</button>
//     </div>
//   );
// }
