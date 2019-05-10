import React, { Component } from 'react';
import './App.css';

import { setUser, Input } from './server/data';

const App = () => {
  const [result, setResult] = React.useState<string>('');
  const [input, setInput] = React.useState<Input>(new Input());
  const send = async () => {
    setResult(await setUser(input));
  }
  const onChangeInput = (key: 'name' | 'email') => ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    input[key] = value;
    setInput(input);
  }

  return (
      <div className="App">
          <header className="App-header">
            Isomor
          </header>
          <div className="App-content">
            <p>Name: <input onChange={onChangeInput('name')} /></p>
            <p>Email: <input onChange={onChangeInput('email')} /></p>
            <button onClick={send}>Send</button>
            {result && <p>
              <b>Server result:</b>
              <pre>{ result }</pre>
            </p>}
          </div>
      </div>
  );
}

export default App;
