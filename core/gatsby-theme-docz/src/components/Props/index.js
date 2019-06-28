/** @jsx jsx */
import { useState } from 'react'
import { jsx } from 'theme-ui'

import { ChevronDown, ChevronUp } from '../Icons'
import * as styles from './styles'

export const Prop = ({ propName, prop, getPropType }) => {
  const [showing, setShowing] = useState(false)
  if (!prop.type && !prop.flowType) return null

  const toggle = () => setShowing(s => !s)

  return (
    <div sx={styles.line}>
      <div sx={styles.content}>
        <div sx={styles.propName}>{propName}</div>
        <div sx={styles.propType}>{getPropType(prop)}</div>
        {prop.defaultValue && (
          <div sx={styles.defaultValue}>
            {prop.defaultValue.value === "''" ? (
              <em>[Empty String]</em>
            ) : (
              <em>{prop.defaultValue.value.replace(/\'/g, '"')}</em>
            )}
          </div>
        )}
        <div sx={styles.right}>
          {prop.required && (
            <div sx={styles.propRequired}>
              <strong>required</strong>
            </div>
          )}
          {prop.description && (
            <button sx={styles.openDescBtn} onClick={toggle}>
              {showing ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
      </div>
      {showing && prop.description && (
        <div sx={styles.description}>{prop.description}</div>
      )}
    </div>
  )
}

export const Props = ({ props, getPropType }) => {
  const entries = Object.entries(props)

  return (
    <div sx={styles.container}>
      {entries.map(([key, prop]) => (
        <Prop key={key} propName={key} prop={prop} getPropType={getPropType} />
      ))}
    </div>
  )
}
