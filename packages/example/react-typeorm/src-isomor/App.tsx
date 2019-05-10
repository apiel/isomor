import React from 'react';
import './App.css';

import { getList, User } from './server/data';

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
