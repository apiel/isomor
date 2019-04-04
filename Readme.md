
# Isomor

Isomor isa library to create an interface between your backend and your frontend with nodejs and javascript application. Today, fullstack developers often use monorepo to centralize all there architecture inside a single place. This library allow you to do even more. Instead to have different application for backend and frontend, you develop a single "isomorphic" application and `isomor` will take care to split the code and setup a communication protocole. See following example:

```
class App extends Component {
  state = { list: [] };

  async componentDidMount() {
    const input: GetListInput = { foo: 'magic' };
    const list = await getList(input);
    this.setState({ list });
  }

  render() {
    return (
      <ul>
        { this.state.list.map((item, index) => <li key={index}>{item}</li>) }
      </ul>
    );
  }
}
```

```
import { readdir } from 'fs-extra';
import { GetListInput } from './getList.input';

export async function getList(input: GetListInput): Promise<string[]> {
    const files = await readdir('./');
    return files.map(file => `${file}-${input.foo}-${Math.random()}`);
}
```

As you can see, on `componentDidMount` the app is calling `getList` that is located on the server. So, the first thing that might comme to your mind, might be "aaaah it's server side rendering". But no, **I am not speaking about SSR**. Isomor, is transpiling `getList` to a magic function that will call the backend through an http request. Like this, we have very consistent code between backend and server, especially if you are using types.

Right now I implemented this library for TypeScript, since types bring lot of value to this concept. I didn't tried but it might work as well with flowtype. Very soon, I will update the library to support JavaScript as well. Also, till now I did all my test on React, but it might work with Angular, VueJs and so on.

### How to use it



### ToDo

- make server exportable
    - server can be exported by another express instance
    - server should also be able to serv static files from generated js file after `react-create-app build`
- make transpiler work for single file
- support JS (remove type from generated code)
- create react hook to consume server files
    - hook should also be able to handle cache
- websocket version where server could call frontend functions
- add config file using `cosmiconfig` lib
