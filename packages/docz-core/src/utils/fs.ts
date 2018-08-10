import * as path from 'path'
import * as fs from 'fs-extra'
import { compile } from 'art-template'

import { format } from './format'

export const touch = (file: string, raw: string) =>
  new Promise(async (resolve, reject) => {
    const content = /jsx?$/.test(path.extname(file)) ? await format(raw) : raw
    const stream = fs.createWriteStream(file)

    stream.write(content, 'utf-8')
    stream.on('finish', () => resolve())
    stream.on('error', err => reject(err))
    stream.end()
  })

export const read = (file: string): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    let data = ''
    const stream = fs.createReadStream(file, { encoding: 'utf-8' })

    stream.on('data', chunk => (data += chunk))
    stream.on('end', () => resolve(data))
    stream.on('error', err => reject(err))
  })

export const readIfExist = async (file: string): Promise<string | null> => {
  const exist = await fs.pathExists(file)
  return exist ? read(file) : Promise.resolve(null)
}

export const compiled = async (
  file: string,
  opts: Record<string, any> = {}
): Promise<(args: any) => string> =>
  read(file)
    .then(data => compile(data, opts))
    .catch(err => err)
