import * as React from 'react'
import express, { Request, Response } from 'express'
import { Arguments } from 'yargs'
import { renderToString } from 'react-dom/server'

import { componentsFromPattern } from './utils/components'
import { createBundle, DIST_PATH } from './utils/bundle'
import { generateEntry } from './utils/entry'

import { Html } from './components/Html'

exports.server = async ({ files: pattern }: Arguments) => {
  const app = express()
  const components = componentsFromPattern(pattern)
  const html = renderToString(<Html components={components} />)
  const entry = generateEntry(components)

  const bundle = await createBundle(html, entry)

  app.use(express.static(DIST_PATH))
  app.use('/*', async (req: Request, res: Response) => {
    res.sendFile(bundle.name)
  })

  app.listen(3000)
}
