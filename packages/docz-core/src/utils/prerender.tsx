import puppeteer from 'puppeteer'
import { State } from '../states'
import * as path from 'path'
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
  const paths = Object.keys(state.entries!)
  const app = express()
  const browser = await puppeteer.launch()

  app.use(express.static(args.dest))
  app.use('*', express.static(args.dest))
  await app.listen(args.port)

  const preRendered = await paths.reduce(async (promise, path): Promise<
    PreRendered
  > => {
    const acc = await promise
    const entry = state.entries![path]
    const page = await browser.newPage()

    page.setUserAgent('node')

    await page.goto(`http://127.0.0.1:${args.port}${entry.route}`)

    const html = await page.evaluate(() => document.documentElement.outerHTML)

    acc[entry.route] = html
    return acc
  }, Promise.resolve({} as PreRendered))

  return preRendered
}

export function writeEntries(args: Args, preRendered: PreRendered): void {
  Object.keys(preRendered!).map(route => {
    const html = preRendered![route]
    const dist = path.resolve(args.dest, `./${route}`)
    if (!fs.existsSync(dist)) {
      fs.mkdirSync(dist)
    }

    fs.writeFileSync(`${dist}/index.html`, html)
  })
}

export { prerender }
