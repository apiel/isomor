import React, { Component } from 'react';
import './App.css';

import { setUser, Input } from './server/data';
import { validate } from 'class-validator';

const App = () => {
  const [clientErrors, setClientErrors] = React.useState<string>('');
  const [result, setResult] = React.useState<string>('');
  const [input, setInput] = React.useState<Input>(new Input());
  const send = async () => {
    setResult(await setUser(input));
  }
  const onChangeInput = (key: 'name' | 'email') => async ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    input[key] = value;
    const errors = await validate(input);
    setClientErrors(JSON.stringify(errors, null, 4));
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
            <button onClick={send}>Server validation</button>
            {result && <>
              <p><b>Server result:</b></p>
              <pre>{ result }</pre>
            </>}
            {clientErrors && <>
              <p><b>Client validation:</b></p>
              <pre>{ clientErrors }</pre>
            </>}
          </div>
      </div>
  );
}

export default App;
