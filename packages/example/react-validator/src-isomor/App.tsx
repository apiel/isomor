import React, { Component } from 'react';
import './App.css';

import { setUser, Input } from './server/data';

const App = () => {
  const [result, setResult] = React.useState<string>();
  const call = async () => {
    const input = new Input();
    input.name = 'Alexandre';
    input.email = 'alexandre.piel@gmail.com';
    setResult(await setUser(input));
  }
  React.useEffect(() => { call(); }, []);
  return (
      <div className="App">
          <header className="App-header">
            Isomor
          </header>
          <div className="App-content">
            <p>
              <b>Result:</b>
              <pre>{ result || 'loading...' }</pre>
            </p>
          </div>
      </div>
  );
}

export default App;
