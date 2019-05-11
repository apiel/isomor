import React from 'react';
import './App.css';

import { setUser, Input, getUser } from './server/data';

const loadUser = async (
  setAuth: React.Dispatch<React.SetStateAction<string>>,
) => {
  setAuth(await getUser());
}

const loggin = (
  setAuth: React.Dispatch<React.SetStateAction<string>>,
  input: Input,
) => async () => {
  try {
    setAuth(await setUser(input));
  } catch (error) {
    console.log('error', error);
  }
}

const onChangeInput = (
  key: 'username' | 'password',
  setInput: React.Dispatch<React.SetStateAction<Input>>,
  input: Input,
) => async (
  { target: { value } }: React.ChangeEvent<HTMLInputElement>
) => {
  input[key] = value;
  setInput(input);
}

const App = () => {
  const [auth, setAuth] = React.useState<string>('');
  const [input, setInput] = React.useState<Input>({ username: '', password: '' });

  React.useEffect(() => {
    loadUser(setAuth);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        Isomor Auth
      </header>
      <div className="App-content">
        { auth
          ? (
            <p>Welcome {auth}</p>
          ) : (
            <>
              <p>Username: <input onChange={onChangeInput('username', setInput, input)} /> (demo)</p>
              <p>Password: <input onChange={onChangeInput('password', setInput, input)} type="password" /> (1234)</p>
              <button onClick={loggin(setAuth, input)}>Login</button>
            </>
          )
        }
      </div>
    </div>
  );
}

export default App;
