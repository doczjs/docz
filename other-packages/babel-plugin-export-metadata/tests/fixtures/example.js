const foo = () => 'foo'
export const bar = () => 'bar'

const obj = {
  foo: () => 'foo',
}

/**
 * Some description
 */
function get(object, path) {
  return object[path]
}

export function getOther(object, path) {
  return object[path]
}

const obj2 = {
  get: () => null,
}

/**
 * Some description
 */
class Abc {
  /**
   * Some description
   */
  method() {
    return null
  }
}

export const component = styled.div`
  background: red;
`

export class Abcd {
  /**
   * Some description
   */
  method() {
    return null
  }
}

const obj3 = {
  method: class Abcd {
    method() {
      return null
    }
  },
}

const log = fn => fn(1)
log(id => console.log(id))

export default () => 'other'
