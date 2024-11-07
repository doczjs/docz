import capitalize from 'capitalize'

import { PropType, FlowType } from '../components/Props'

const RE_OBJECTOF =
  /(?:React\.)?(?:PropTypes\.)?objectOf\((?:React\.)?(?:PropTypes\.)?(\w+)\)/

const getTypeStr = (type: PropType | FlowType): any => {
  switch (type.name.toLowerCase()) {
    case 'instanceof':
      return `Class(${type.value})`
    case 'enum':
      if (type.computed) return type.value
      return type.value
        ? type.value.map((v: any) => `${v.value}`).join(' │ ')
        : type.raw
    case 'union':
      return type.value
        ? type.value.map((t: any) => `${getTypeStr(t)}`).join(' │ ')
        : type.raw
    case 'array':
      return type.raw
    case 'arrayof':
      return `Array<${getTypeStr(type.value)}>`
    case 'custom':
      if (type.raw.indexOf('function') !== -1 || type.raw.indexOf('=>') !== -1)
        return 'Custom(Function)'
      else if (type.raw.toLowerCase().indexOf('objectof') !== -1) {
        const m = type.raw.match(RE_OBJECTOF)
        if (m && m[1]) return `ObjectOf(${capitalize(m[1])})`
        return 'ObjectOf'
      }
      return 'Custom'
    case 'bool':
      return 'Boolean'
    case 'func':
      return 'Function'
    case 'shape':
      const shape = type.value
      const rst: any = {}
      Object.keys(shape).forEach(key => {
        rst[key] = getTypeStr(shape[key])
      })

      return JSON.stringify(rst, null, 2)
    default:
      return type.name
  }
}

export const humanize = (type: PropType | FlowType) => getTypeStr(type)
