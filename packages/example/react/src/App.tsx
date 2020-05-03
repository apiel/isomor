import React from 'react';
import './App.css';

import { Auth } from './Auth';
import { ErrorExample } from './ErrorExample';
import { UpTime } from './Uptime';
import { Color } from './Color';
import { Form } from './Form';

const App = () => {
  return (
      <div className="App">
          <header className="App-header">
            Isomor <Auth />
          </header>
          <div className="App-content">
            <UpTime />
            <Color />
            <ErrorExample />
            <Form />
          </div>
      </div>
  );
}

export default App;
