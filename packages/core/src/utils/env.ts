/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */

import _ from 'lodash';

let meta = { env: {} };

/**
 * Replace a character in the string provided taking care of the escaped chars.
 * @private
 * @param  {string} str A string.
 * @param  {from} from A character.
 * @param  {to} to A character.
 * @return {string} A new string with the character replaced.
 */
function transform(str: string, from: any, to: any) {
  let out = '';
  const escaped = `\\${to}`;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === to) {
      out += escaped;
    } else if (str[i] === from) {
      out += to;
    } else if (str[i] === '\\' && i + 1 < str.length && str[i + 1] === from) {
      out += from;
      i++;
    } else {
      out += str[i];
    }
  }

  return out;
}

/**
 * Converts a dot-path to an underscore-path.
 * @private
 * @param  {string} path A string separated by dots.
 * @return {string} A new string separated by underscores.
 */
function toUnderscore(path: string) {
  return transform(path, '.', '_');
}

/**
 * Converts an underscore-path to a dot-path.
 * @private
 * @param  {string} env A string separated by underscores.
 * @return {string} A new string separated by dots.
 */
function toDot(env: string) {
  return transform(env, '_', '.');
}

/**
 * Return a list of environment variables that matches the path provided.
 * @private
 * @param  {string} path A string separated by dots.
 * @param  {Object} [opts] Additional options.
 * @return {string[]} An array of environment variables.
 */
function keys(path: string, opts: any = {}) {
  let env = toUnderscore(path);

  if (!opts.caseSensitive) {
    env = env.toUpperCase();
    return Object.keys(meta.env).filter((key) =>
      key.toUpperCase().startsWith(env)
    );
  }

  return Object.keys(meta.env).filter((key) => key.startsWith(env));
}

function parse(str: string, opts: any = {}) {
  if (typeof str !== 'string' || !opts.parse) {
    return str;
  }

  if (/^\s*undefined\s*$/.test(str)) {
    return undefined;
  }

  const val = Number(str);
  if (!isNaN(val) || /^\s*NaN\s*$/.test(str)) {
    return val;
  }

  try {
    return JSON.parse(str);
  } catch (error) {
    return str;
  }
}

function stringify(val: string, opts: any = {}) {
  if (typeof val === 'string' || !opts.stringify) {
    return val;
  }

  if (typeof val === 'object') {
    return JSON.stringify(val);
  }

  return String(val);
}

/**
 * Gets the values of environment variables at the path specified.
 * @public
 * @param  {string} path Dot separated path.
 * @param  {any} [defaultValue=undefined] Default value to return if there is
 * not any environment variable that matches the path provided.
 * @param  {Object} [opts] Additional options.
 * @param  {boolean} [opts.parse=false] If true the value retrieved is converted
 * to the proper type.
 * @param  {boolean} [opts.caseSensitive=false] If true no case conversion will
 * be performed from the dot path provided to the env key search.
 * Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY.
 * @return {any} The values of environment variables associated with the path specified.
 */
export function get(path: any, defaultValue?: any, opts: any = {}) {
  let obj: any;
  const args = [].slice.call(arguments);
  path = args.shift();
  if (typeof args[args.length - 1] === 'object') {
    opts = args.pop();
  } else {
    opts = {};
  }

  defaultValue = args.pop();

  keys(path, opts)
    .sort((a, b) => a.length - b.length)
    .forEach((key) => {
      let dotp = toDot(key);
      if (!opts.caseSensitive) {
        dotp = dotp.toLowerCase();
      }

      const val = parse(meta.env[key] as any, opts);
      if (dotp === '') {
        obj = val;
      } else {
        if (typeof obj !== 'object') {
          obj = {};
        }

        _.set(obj, dotp, val);
      }
    });

  let prefix = path;
  if (!opts.caseSensitive) {
    prefix = prefix.toLowerCase();
  }

  if (path === '') {
    return obj;
  }

  return _.get(obj, prefix, defaultValue);
}

/**
 * Sets an env key at the path specified. If nested keys are present they will
 * be deleted.
 * @public
 * @param  {string} path Dot separated path.
 * @param  {string} value Value to set.
 * @param  {object} [opts] Additional options.
 * @param  {boolean} [opts.stringify=false] If true the value provided is
 * converted to string.
 * @param  {boolean} [opts.caseSensitive=false] If true no case conversion is
 * performed from the dot path provided to the env key search.
 * Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY.
 */
export function set(path: string, value: string, opts: any = {}) {
  if (typeof opts === 'undefined') {
    opts = {};
  }

  let env = toUnderscore(path);
  if (!opts.caseSensitive) {
    env = env.toUpperCase();
  }

  del(path, opts);
  meta.env[env] = stringify(value, opts);
}

/**
 * Deletes an env key at the path specified.
 * If nested keys are present they will be deleted too.
 * @public
 * @param  {string} path A dot separated path.
 * @param  {object} [opts] Additional options.
 * @param  {boolean} [opts.caseSensitive=false] If true no case conversion is
 * performed from the dot path provided to the env key search.
 * Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY.
 */
export function del(path: string, opts: any = {}) {
  if (typeof opts === 'undefined') {
    opts = {};
  }

  keys(path, opts).forEach((key) => delete meta.env[key]);
}

/**
 * Returns whether an env key exists at the path specified.
 * @public
 * @param  {string} path Dot separated path.
 * @param  {object} [opts] Additional options.
 * @param  {boolean} [opts.caseSensitive=false] If true no case conversion is
 * performed from the dot path provided to the env key search.
 * Eg: 'tesT.kEy' will look for tesT_kEy environment variable instead of TEST_KEY.
 * @return {boolean} true if exists at least one environment variables with that
 * path prefix.
 */
export function has(path: string, opts: any = {}) {
  if (typeof opts === 'undefined') {
    opts = {};
  }

  return keys(path, opts).length > 0;
}
