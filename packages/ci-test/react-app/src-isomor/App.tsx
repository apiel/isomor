import React from 'react';
import './App.css';
import { Hello } from './Hello';
import { Count } from './count/count';
import { Color } from './color/color';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        Isomor test
      </header>
      <Count e2eId="count-1" />
      <Count e2eId="count-2" />
      <Color e2eId="color-1" />
      <Color e2eId="color-2" />
      <Hello e2eId="hello-1" />
    </div>
  );
}

export default App;
