declare module 'copy-text-to-clipboard'
declare module 'hotkeys-js'
declare module 'codemirror/mode/markdown/markdown'
declare module 'codemirror/mode/javascript/javascript'
declare module 'codemirror/mode/jsx/jsx'
declare module 'codemirror/mode/css/css'
declare module 'codemirror/addon/edit/matchbrackets'
declare module 'codemirror/addon/edit/closetag'
declare module 'codemirror/addon/fold/xml-fold'
declare module 'match-sorter'
declare module 'react-perfect-scrollbar'
declare module 'pretty'
declare module 'polished/lib/color/rgba'
declare module 'polished/lib/color/lighten'
declare module 'polished/lib/color/darken'
declare module 'react-codemirror2'
declare module 'react-feather/dist/icons/edit-2'
declare module 'react-feather/dist/icons/chevron-down'
declare module 'react-feather/dist/icons/search'
declare module 'react-feather/dist/icons/clipboard'
declare module 'react-feather/dist/icons/check'
declare module 'react-feather/dist/icons/smartphone'
declare module 'react-feather/dist/icons/tablet'
declare module 'react-feather/dist/icons/monitor'
declare module 'react-feather/dist/icons/maximize'
declare module 'react-feather/dist/icons/minimize'
declare module 'react-feather/dist/icons/refresh-cw'
declare module 'react-feather/dist/icons/hash'
declare module 'react-lightweight-tooltip'
declare module 'react-powerplug'
declare module 'react-sizes'
declare module 're-resizable'
declare module 'webfontloader'

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
