import * as path from 'path'
import * as ctags from 'common-tags'
import { compiled } from 'docz-utils/lib/fs'
import {
  generateCSSReferences,
  generateJSReferences,
} from 'mini-html-webpack-plugin'

import * as paths from '../config/paths'
import { Config } from '../config/argv'
import { fromTemplates } from '../lib/Entries'

const runKitVendor = {
  css: `<link href="https://fonts.googleapis.com/css?family=Fira+Sans:400,700|Ubuntu+Mono:400"
  type="text/css"
  rel="stylesheet"
/>`,
  js: '<script type="text/javascript" src="https://embed.runkit.com"></script>',
}

const wrapItems = (item: any) =>
  Object.keys(item)
    .map(key => `${key}="${item[key]}"`)
    .join(' ')

export type tagsTemplate = (type: string) => string
const generateTags = (template: tagsTemplate) => (items: any[] = []) =>
  items.map(template).join('')

const generateMetaTags = generateTags(item => `<meta ${wrapItems(item)}>`)
const generateLinkTags = generateTags(item => `<link ${wrapItems(item)}>`)
const generateScriptTags = generateTags(
  item => `<script ${wrapItems(item)}></script>`
)

const generateRawTags = (items: any[] = []) => {
  if (typeof items === 'string' || items instanceof String) return items
  return items.map(item => item).join('')
}

const getHtmlFilepath = (indexHtml: string | undefined) =>
  indexHtml
    ? path.resolve(paths.root, indexHtml)
    : fromTemplates('index.tpl.html')

const getPublicUrl = (config: Config, dev: boolean): string => {
  const prefix = config.base === '/' ? '' : config.base
  return dev ? prefix : `${prefix}/public`
}

const emptyLineTrim = new ctags.TemplateTag(
  ctags.replaceResultTransformer(/^\s*[\r\n]/gm, ''),
  ctags.trimResultTransformer
)

export const htmlTemplate = async (indexHtml: string | undefined) =>
  compiled(getHtmlFilepath(indexHtml), {
    minimize: false,
    escape: false,
  })

interface ParseHtmlParams {
  config: Config
  ctx: Record<string, any>
  dev: boolean
  template: (props: Record<string, any>) => string
}

export const parseHtml = ({ config, ctx, dev, template }: ParseHtmlParams) => {
  const { title, description, runKit } = config
  const {
    publicPath,
    css,
    js,
    lang = 'en',
    favicon,
    head = [],
    body = [],
    trimWhitespace,
  } = ctx

  const headStr = `
    ${favicon ? `<link rel="icon" type="image/x-icon" href="${favicon}">` : ''}
    ${head.meta ? generateMetaTags(head.meta) : ''}
    ${head.links ? generateLinkTags(head.links) : ''}
    ${runKit ? runKitVendor.css : ''}
    ${head.raw ? generateRawTags(head.raw) : ''}
    ${runKit ? runKitVendor.js : ''}
    ${head.scripts ? generateScriptTags(head.scripts) : ''}
    ${generateCSSReferences(css, publicPath)}`

  const footerStr = `
    ${body.raw ? generateRawTags(body.raw) : ''}
    ${body.scripts ? generateScriptTags(body.scripts) : ''}
    ${generateJSReferences(js, publicPath)}`

  const doc = ctags.html(
    template({
      title,
      description,
      lang,
      head: headStr,
      footer: footerStr,
      publicUrl: getPublicUrl(config, dev),
    })
  )

  return trimWhitespace ? ctags.oneLineTrim(doc) : emptyLineTrim(doc)
}
