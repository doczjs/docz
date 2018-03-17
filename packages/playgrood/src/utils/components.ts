import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import { v4 } from 'uuid'
import { parse } from 'babylon'
import { File, Comment } from 'babel-types'

export interface IComponent {
  readonly id: string
  readonly filepath: string
  readonly route: string
  readonly name: string | null
  readonly hasManifest: boolean
}

const ROOT_PATH = fs.realpathSync(process.cwd())

const convertToAst = (entry: string): File =>
  parse(fs.readFileSync(entry, 'utf-8'), {
    sourceType: 'module',
    plugins: ['jsx'],
  })

const findManifest = ({ comments }: File): Comment | undefined =>
  comments.find(({ value }) => /\@playgrodd/.test(value))

const nameOnManifest = (manifest: Comment | undefined): string | null => {
  const match = manifest && manifest.value.match(/(?:\@name\:\s)(\w+)/)
  return match ? match[1] : null
}

const parseEntry = (entry: string) => {
  const ast = convertToAst(entry)
  const manifest = findManifest(ast)
  const name = nameOnManifest(manifest)
  const route = path.join(path.parse(entry).dir, name || '')
  const filepath = path.join(ROOT_PATH, entry)

  return {
    id: v4(),
    name,
    filepath,
    route,
    hasManifest: !!manifest,
  }
}

const filterByManifest = (component: IComponent) => !!component.hasManifest

export const componentsFromPattern = (pattern: string): IComponent[] => {
  const ignoreGlob = '!node_modules'
  const entries: string[] = glob.sync(
    Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
  )

  return entries.map(parseEntry).filter(filterByManifest)
}
