/* eslint-disable no-async-promise-executor */
import artTemplate from 'art-template';
import fs from 'fs-extra';
import path from 'path';

import { format } from './format';

export const touch = (file: string, raw: string) =>
  new Promise(async (resolve, reject) => {
    const content = /jsx?$/.test(path.extname(file)) ? await format(raw) : raw;
    const stream = fs.createWriteStream(file);

    stream.write(content, 'utf-8');
    stream.on('finish', () => resolve(null));
    stream.on('error', (err) => reject(err));
    stream.end();
  });

export const compiled = (file: string, opts: Record<string, any> = {}) => {
  const raw = fs.readFileSync(file, { encoding: 'utf-8' });
  return artTemplate.compile(raw, opts);
};
