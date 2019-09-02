import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Playground } from '../dist/';

const App = () => {
  return (
    <div>
      <Playground
        code={'<Button>asd</Button>'}
        // theme={{
        //   styles: [],
        //   plain: {
        //     fontFamily: 'Inconsolata',
        //     fontSize: 308,
        //     lineHeight: '1.5em',
        //   },
        // }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
