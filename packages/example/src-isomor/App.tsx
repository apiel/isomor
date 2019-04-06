import React, { Component } from 'react';
import './App.css';

import { getList } from './server/data';
import { GetListInput } from './server/getList.input';
import { Uptime } from './status/uptime';

class App extends Component {
  state = {
    list: []
  };

  async componentDidMount() {
    await this.onRemoteLoad();
  }

  onRemoteLoad = async () => {
    const input: GetListInput = { foo: 'magic' };
    const list = await getList(input);
    this.setState({ list });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Isomor
        </header>
        <ul>
          {
            this.state.list.map((item, index) => <li key={index}>{item}</li>)
          }
        </ul>
        <button onClick={this.onRemoteLoad}>load again</button>
        <Uptime />
      </div>
    );
  }
}

// // Functional example
// const App2 = () => {
//   const [list, setList] = React.useState<string[]>([]);
//   const load = async () => {
//     const input: GetListInput = { foo: 'magic' };
//     setList(await getList(input));
//   }
//   React.useEffect(() => { load(); }, []);
//   return (
//     <div className="App">
//       <header className="App-header">
//         Isomor
//     </header>
//       <ul>
//         {
//           list.map((item, index) => <li key={index}>{item}</li>)
//         }
//       </ul>
//       <button onClick={load}>load again</button>
//       <Uptime />
//     </div>
//   );
// }

export default App;
