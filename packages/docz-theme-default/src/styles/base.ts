import { injectGlobal } from 'emotion'

// tslint:disable
export const base = (config: any) =>
  injectGlobal`
    body {
      font-family: ${config.styles.body.fontFamily};
      font-size: ${config.styles.body.fontSize};
      line-height: ${config.styles.body.lineHeight};
    }
  `
