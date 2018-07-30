declare module 'copy-text-to-clipboard'
declare module 'hotkeys-js'
declare module 'react-breakpoints'
declare module 'react-feather/dist/icons/chevron-down'
declare module 'react-feather/dist/icons/search'
declare module 'react-feather/dist/icons/clipboard'
declare module 'react-feather/dist/icons/check'
declare module 'react-feather/dist/icons/smartphone'
declare module 'react-feather/dist/icons/tablet'
declare module 'react-feather/dist/icons/monitor'
declare module 'react-feather/dist/icons/maximize'
declare module 'react-feather/dist/icons/minimize'
declare module 'react-lightweight-tooltip'
declare module 'react-powerplug'
declare module 'react-syntax-highlighter/prism-light'
declare module 're-resizable'
declare module 'match-sorter'
declare module 'polished/lib/color/rgba'
declare module 'polished/lib/color/lighten'
declare module 'polished/lib/color/darken'
declare module 'pretty'
declare module 'webfontloader'

declare module '*.svg' {
  const content: any
  export default content
}

declare module 'facepaint' {
  interface Styles {
    [key: string]: string | number | Styles
  }

  interface MqStyles {
    [key: string]: string | string[] | number | number[] | Styles
  }

  type Mq = (styles: object) => Styles

  interface FacepaintSettings {
    literal?: boolean
    overlap?: boolean
  }

  type Facepaint = (
    /** media queries to be applied across */
    mediaQueries: string[],
    settings?: FacepaintSettings
  ) => Mq

  const facepaint: Facepaint

  export = facepaint
}
