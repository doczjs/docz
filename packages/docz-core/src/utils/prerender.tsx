import puppeteer from 'puppeteer'
import { State } from '../states'
import * as path from 'path'
import * as paths from '../config/paths'
import { Config as Args } from '../commands/args'
import express from 'express'
import fs from 'fs'

interface PreRendered {
  [path: string]: string
}

export default async function prerender(
  args: Args,
  state: State
): Promise<PreRendered> {
  const app = express()
  const browser = await puppeteer.launch()

  app.use(express.static(path.resolve(paths.docz, 'dist/')))
  await app.listen(args.port)

  return Object.keys(state.entries!).reduce(async (promise, path): Promise<
    PreRendered
  > => {
    const acc = await promise
    const page = await browser.newPage()
    const entry = state.entries![path]

    await page.goto(`http://127.0.0.1:${args.port}/${entry.route}`)

    const html = await page.evaluate(() => document.documentElement.innerHTML)
    acc[entry.route] = html
    return acc
  }, Promise.resolve({} as PreRendered))
}

export function writeEntries(args: Args, preRendered: PreRendered): void {
  Object.keys(preRendered!).map(route => {
    const html = preRendered![route]
    const dist = path.resolve(args.dest, `./${route}`)
    fs.writeFileSync(`${dist}/index.html`, html)
  })
}

export { prerender }
