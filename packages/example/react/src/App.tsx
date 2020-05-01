import React from 'react';
import './App.css';

import { Auth } from './Auth';
import { ErrorExample } from './ErrorExample';
import { UpTime } from './Uptime';
import { Color } from './Color';

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
          </div>
      </div>
  );
}

export default App;
