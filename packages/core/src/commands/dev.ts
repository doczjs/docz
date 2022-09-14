/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import withMDX from '@next/mdx';
import { createServer } from 'http';
import { merge } from 'lodash/fp';
import next from 'next';
import { parse } from 'url';
import type { Arguments } from 'yargs';

import { parseConfig } from '~/config/docz';
import { copyDoczRc } from '~/helpers/resources';

export async function dev(args: Arguments<any>) {
  await copyDoczRc(args.config);
  const config = await parseConfig(args);
  const mdxConfig = withMDX({
    extension: /\.mdx?$/,
    options: {
      remarkPlugins: config.remarkPlugins,
      rehypePlugins: config.rehypePlugins,
    },
  });

  const dev = process.env.NODE_ENV !== 'production';
  const { host: hostname, port } = config;
  const customNextConfig = mdxConfig({
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  });

  const app = next({
    dev,
    hostname,
    port,
    dir: config.paths.app,
    conf: merge(config.nextConfig, customNextConfig),
  });

  const handle = app.getRequestHandler();
  await app.prepare();

  const server = createServer(async (req, res) => {
    try {
      if (!req.url) throw new Error("req.url don't exist");
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}
