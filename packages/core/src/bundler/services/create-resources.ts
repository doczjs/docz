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

export const writeDefaultNotFound = async () => {
  const outputPath = path.join(paths.app, 'pages/404.js');
  // If it exists then it would have been created in ensureFiles while copying the theme
  if (fs.existsSync(outputPath)) return;
  await outputFileFromTemplate('404.tpl.js', outputPath, {});
};

export const writeNextFiles = async ({ title }: Config) => {
  const outputPathApp = path.join(paths.app, 'pages/_app.js');
  const outputPathDocument = path.join(paths.app, 'pages/_document.js');
  await outputFileFromTemplate('_app.tpl.js', outputPathApp, { title });
  await outputFileFromTemplate('_document.tpl.js', outputPathDocument);
};

export const createResources = async (ctx: ServerMachineCtx) => {
  try {
    copyDoczRc(ctx.args.config);
    copyDotEnv();
    await writeEslintRc();
    await writeNextFiles(ctx.args);
    await copyEslintIgnore();
    await writeDefaultNotFound();
  } catch (err) {
    log.error(err);
  }
};
