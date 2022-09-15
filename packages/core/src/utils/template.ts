/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs-extra';
import * as path from 'path';

import { format } from './format';
import { compiled } from './fs';

import * as paths from '~/config/paths';

export const fromTemplates = (file: string) => {
  return path.join(paths.templates, file);
};

export const outputFileFromTemplate = async (
  templatePath: string,
  outputPath: string,
  templateProps?: Record<string, any>,
  compileProps?: Record<string, any>,
  needFormat?: boolean
) => {
  const filepath = fromTemplates(templatePath);
  const template = compiled(filepath, compileProps || { minimize: false });
  const file = template(templateProps || {});
  const raw = needFormat ? await format(file) : file;
  await fs.outputFile(outputPath, raw);
};
