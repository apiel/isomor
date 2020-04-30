import React from 'react';
import './App.css';

import { getList } from './server/data';
import { GetListInput } from './server/getList.input';
import { Stats } from './status/stats';
import { Auth } from './auth/auth';
import { ErrorExample } from './error/ErrorExample';
import { Time } from './status/time';
import { Color } from './color/color';
import { yoyo } from 'yoyo3';

yoyo();

const App = () => {
  const [list, setList] = React.useState<string[]>([]);
  const load = async () => {
      const input: GetListInput = { foo: 'magic' };
      setList(await getList(input));
  }
  React.useEffect(() => { load(); }, []);
  return (
      <div className="App">
          <header className="App-header">
            Isomor <Auth />
          </header>
          <div className="App-content">
            <ul>
              {
                list.map((item, index) => <li key={index}>{item}</li>)
              }
            </ul>
            <button onClick={load}>load again</button>
            <Time />
            <Color />
            <Stats />
            <ErrorExample />
          </div>
      </div>
  );
}

export default App;

// class App extends Component {
//   state = {
//     list: []
//   };

//   async componentDidMount() {
//     await this.onRemoteLoad();
//   }

//   onRemoteLoad = async () => {
//     const input: GetListInput = { foo: 'magic' };
//     const list = await getList(input);
//     this.setState({ list });
//   }

//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           Isomor
//           <Time />
//         </header>
//         <Stats />
//         <Time />
//         <hr />
//         <ul>
//           {
//             this.state.list.map((item, index) => <li key={index}>{item}</li>)
//           }
//         </ul>
//         <button onClick={this.onRemoteLoad}>load again</button>
//       </div>
//     );
//   }
// }
