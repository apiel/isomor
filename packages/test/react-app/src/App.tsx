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
      <Count />
      <Count />
      <Color />
      <Color />
      <Hello />
    </div>
  );
}

export default App;
