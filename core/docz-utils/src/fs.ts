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

export const compiled = (file: string, opts: Record<string, any> = {}) => {
  const raw = fs.readFileSync(file, { encoding: 'utf-8' })
  return compile(raw, opts)
}
