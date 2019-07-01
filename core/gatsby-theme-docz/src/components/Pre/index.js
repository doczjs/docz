/** @jsx jsx */
import { jsx } from 'theme-ui'
import { preToCodeBlock } from 'mdx-utils'

import * as styles from './styles'
import { Code } from '../Code'

export const Pre = preProps => {
  const props = preToCodeBlock(preProps)
  if (props) {
    return (
      <div sx={styles.wrapper}>
        <Code {...props} readOnly />
        <span sx={styles.language}>{props.language}</span>
      </div>
    )
  } else {
    return <pre {...preProps} />
  }
}
