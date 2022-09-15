import * as fs from 'fs-extra';
import * as path from 'path';
import log from 'signale';

import type { ServerMachineCtx } from '../machine/context';

import * as paths from '~/config/paths';
import type { Config } from '~/types';
import { outputFileFromTemplate } from '~/utils/template';

export async function copyDoczRc(configPath?: string) {
  const sourceDoczRc = configPath
    ? path.join(paths.root, configPath)
    : path.join(paths.root, 'doczrc.js');

  await fs.ensureDir(paths.root);
  const hasDoczRc = fs.existsSync(sourceDoczRc);
  if (!hasDoczRc) return;

  const destinationDoczRc = path.join(paths.docz, 'doczrc.js');
  await fs.copy(sourceDoczRc, destinationDoczRc);
}

const writeEslintRc = async () => {
  const possibleFilenames = [
    '.eslintrc.js',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
    '.eslintrc',
  ];
  for (const filename of possibleFilenames) {
    const filepath = path.join(paths.root, filename);
    const dest = path.join(paths.docz, filename);
    if (fs.pathExistsSync(filepath)) {
      await fs.copy(filepath, dest);
      return;
    }
  }
};

const copyDotEnv = () => {
  const filename = '.env';
  const filepath = path.join(paths.root, filename);
  const dest = path.join(paths.docz, filename);

  if (fs.pathExistsSync(filepath)) {
    fs.copySync(filepath, dest);
  }
};

const copyEslintIgnore = async () => {
  const filename = '.eslintignore';
  const filepath = path.join(paths.root, filename);
  const dest = path.join(paths.docz, filename);

  if (fs.pathExistsSync(filepath)) {
    await fs.copy(filepath, dest);
  }
};

export const writeNextFiles = async ({ title }: Config) => {
  const outputPath404 = path.join(paths.app, 'pages/404.jsx');
  if (!fs.existsSync(outputPath404)) {
    await outputFileFromTemplate('404.tpl.jsx', outputPath404);
  }
  const outputPathApp = path.join(paths.app, 'pages/_app.jsx');
  const outputPathDocument = path.join(paths.app, 'pages/_document.jsx');
  const outputPathJSConfig = path.join(paths.app, 'jsconfig.json');
  await outputFileFromTemplate('_app.tpl.jsx', outputPathApp, { title });
  await outputFileFromTemplate('_document.tpl.jsx', outputPathDocument);
  await outputFileFromTemplate('jsconfig.tpl.json', outputPathJSConfig);
};

export const createResources = async (ctx: ServerMachineCtx) => {
  try {
    copyDoczRc(ctx.args.config);
    copyDotEnv();
    await writeEslintRc();
    await writeNextFiles(ctx.args);
    await copyEslintIgnore();
  } catch (err) {
    log.error(err);
  }
};
