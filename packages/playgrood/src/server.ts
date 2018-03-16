import express from 'express'
import { Arguments } from 'yargs'

import { componentsFromPattern } from './utils/components'

exports.server = async ({ files: pattern }: Arguments) => {
  const app = express()
  const components = componentsFromPattern(pattern)

  console.log(components)

  app.listen(3000)
}
