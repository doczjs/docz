import { transform } from '@babel/core';
import fs from 'fs';
import path from 'path';
import plugin from '../src';

let fixture = path.resolve('./tests/fixtures/example.js');

const code = fs.readFileSync(fixture);

it('works', () => {
  const { code: result } = transform(code, {
    plugins: [plugin],
    filename: fixture
  });

  expect(result).toMatchSnapshot();
});
