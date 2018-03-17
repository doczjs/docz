declare module 'parcel-bundler' {
  var Bundler: any
  export default Bundler
}

interface Window {
  __PLAYGRODD_COMPONENTS__: any
}

declare var window: Window
