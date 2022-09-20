import { findUp } from 'find-up';
import fs from 'fs-extra';
import getPkgRepo from 'get-pkg-repo';
import path from 'path';
import logger from 'signale';

import * as paths from '../config/paths';

import type { Config } from '~/types';

// TODO: type repo object returned from get-pkg-repo
export const parseRepo = (): any => {
  try {
    const pkg = fs.readJsonSync(paths.appPackageJson);
    return getPkgRepo(pkg);
  } catch (err) {
    return null;
  }
};

export const getRepoUrl = () => {
  const repo = parseRepo();

  return (
    repo &&
    ((repo.browsetemplate &&
      repo.browsetemplate
        .replace('{domain}', repo.domain)
        .replace('{user}', repo.user)
        .replace('{project}', repo.project)
        .replace('{/tree/committish}', '')) ||
      (repo.browse && repo.browse()))
  );
};

const getBitBucketPath = (branch: string, relative: string) => {
  const querystring = `?mode=edit&spa=0&at=${branch}&fileviewer=file-view-default`;
  const filepath = path.join(`/src/${branch}`, relative, `{{filepath}}`);
  return `${filepath}${querystring}`;
};

const getTree = (repo: any, branch: string, relative: string) => {
  const defaultPath = path.join(`/edit/${branch}`, relative, `{{filepath}}`);
  const bitBucketPath = getBitBucketPath(branch, relative);

  if (repo && repo.type === 'bitbucket') return bitBucketPath;
  return defaultPath;
};

export const getRepoEditUrl = async (config: Config) => {
  try {
    const repo = parseRepo();
    const gitDir = await findUp('.git', { type: 'directory' });
    if (!gitDir) return null;

    const project = path.parse(gitDir).dir;
    const root = path.join(config.paths.root, config.src);
    const relative = path.relative(project, root);
    const tree = getTree(repo, config.editBranch, relative);

    return (
      repo &&
      repo.browsetemplate &&
      repo.browsetemplate
        .replace('{domain}', repo.domain)
        .replace('{user}', repo.user)
        .replace('{project}', repo.project)
        .replace('{/tree/committish}', tree)
    );
  } catch (err) {
    logger.error(err);
    return null;
  }
};
