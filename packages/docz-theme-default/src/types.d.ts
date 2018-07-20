declare module 'react-feather'
declare module 'react-powerplug'
declare module 'react-lightweight-tooltip'
declare module 'react-feather/dist/icons/chevron-down'
declare module 'react-feather/dist/icons/search'
declare module 'webfontloader'
declare module 'react-breakpoints'
declare module 'match-sorter'

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
