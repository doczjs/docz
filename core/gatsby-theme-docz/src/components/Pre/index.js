/** @jsx jsx */
import { jsx } from 'theme-ui'
import { preToCodeBlock } from 'mdx-utils'

import { Code } from '../Code'

export const Pre = preProps => {
  const props = preToCodeBlock(preProps)
  if (props) {
    return <Code {...props} />
  } else {
    return <pre {...preProps} />
  }
}
