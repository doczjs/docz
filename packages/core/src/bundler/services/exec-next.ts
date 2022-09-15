/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/no-explicit-any */
import withMDX from '@next/mdx';
import { createServer } from 'http';
import { merge } from 'lodash/fp';
import next from 'next';
import log from 'signale';
import { parse } from 'url';

import type { ServerMachineCtx } from '../machine/context';

export const execNext = async ({ args: config }: ServerMachineCtx) => {
  const { default: matter } = await import('remark-frontmatter');
  const { default: parseFrontmatter } = await import('remark-parse-yaml');

  const mdxConfig = withMDX({
    extension: /\.mdx?$/,
    options: {
      remarkPlugins: [
        ...config.remarkPlugins,
        parseFrontmatter,
        [matter, ['yaml']],
      ],
      rehypePlugins: [...config.rehypePlugins],
    },
  });

  const dev = process.env.NODE_ENV !== 'production';
  const { host: hostname, port } = config;
  const customNextConfig = mdxConfig({
    distDir: config.public,
    swcMinify: true,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    options: {
      providerImportSource: require.resolve('@mdx-js/react'),
    },
    webpack(config) {
      config.resolve.alias['@mdx-js/react'] = require.resolve('@mdx-js/react');
      return config;
    },
    experimental: {
      externalDir: true,
    },
  });

  const app = next({
    dev,
    hostname,
    port,
    dir: config.paths.app,
    conf: merge(config.nextConfig, customNextConfig),
  });

  // const handle = app.getRequestHandler();
  await app.prepare();

  const server = createServer(async (req, res) => {
    try {
      if (!req.url) throw new Error("req.url don't exist");
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const route = pathname === '/' ? '/' : `/generated${pathname}`;
      await app.render(req, res, route, query);
    } catch (err) {
      log.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  return new Promise((resolve, reject) => {
    // @ts-ignore
    server.listen(port, (err: any) => {
      if (err) throw reject(err);
      log.success(`Docz ready on http://${hostname}:${port}`);
      resolve(null);
    });
  });
};
