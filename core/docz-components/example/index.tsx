import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Playground } from '../';

const App = () => {
  return (
    <div>
      <Playground code={'<h1>asd</h1>'} showPlaygroundEditor={true} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
