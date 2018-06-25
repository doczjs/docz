declare module 'react-feather'
declare module 'react-powerplug'
declare module 'react-lightweight-tooltip'
declare module 'react-feather/dist/icons/chevron-down'
declare module 'react-spinners'
declare module 'react-breakpoints'

declare module '*.svg' {
  const content: any
  export default content
}

declare module 'facepaint' {
  interface Styles {
    [ruleOrSelector: string]: string | number | Styles
  }

  interface MqStyles {
    [ruleOrSelector: string]: string | string[] | number | number[] | Styles
  }

  type Mq = (styles: object) => Styles

  interface FacepaintSettings {
    literal?: boolean
    overlap?: boolean
  }

  type Facepaint = (
    /** media queries to be applied across */
    mediaQueries: [string, string, string],
    settings?: FacepaintSettings
  ) => Mq

  const facepaint: Facepaint

  export = facepaint
}
