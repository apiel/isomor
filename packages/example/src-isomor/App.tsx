import React, { Component } from 'react';
import './App.css';

import { getList } from './server/data';
// import { GetListInput } from './server/getList.input';

class App extends Component {
  state = {
    list: []
  };

  onLocalAdd = () => {
    this.setState({ list: [...this.state.list, 'locale'] });
  }

  onRemoteLoad = async () => {
    // this.setState({ list: [...this.state.list, 'locale'] });
    const input/*: GetListInput*/ = { foo: 'magic' };
    const list = await getList(input);
    this.setState({ list });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <ul>
          {
            this.state.list.map((item, index) => <li key={index}>{item}</li>)
          }
        </ul>
        <button onClick={this.onLocalAdd}>local add</button>
        <button onClick={this.onRemoteLoad}>remote load</button>
      </div>
    );
  }
}

export default App;
