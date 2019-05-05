import React from 'react';
import './App.css';

import { getList, IUser as User } from './server/data';

const App = () => {
  const [list, setList] = React.useState<User[]>([]);
  const load = async () => {
      setList(await getList());
  }
  React.useEffect(() => { load(); }, []);
  return (
      <div className="App">
          <header className="App-header">
            Isomor with TypeORM
          </header>
          <div className="App-content">
            <ul>
              {
                list.map((item, index) => <li key={index}>({item.id}) {item.firstName} {item.lastName}</li>)
              }
            </ul>
            <button onClick={load}>load again</button>
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