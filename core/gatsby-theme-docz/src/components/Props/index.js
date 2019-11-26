/** @jsx jsx */
import { useState } from 'react'
import { jsx } from 'theme-ui'

import { ChevronDown, ChevronUp } from '../Icons'
import * as styles from './styles'

export const getDefaultValue = ({ defaultValue, type, flowType }) => {
  const propType = flowType ? flowType : type
  if (!defaultValue || !defaultValue.value) return null
  if (defaultValue.value === "''") {
    return '[Empty string]'
  }
  if (propType && propType.name === 'string') {
    return defaultValue.value.replace(/\'/g, '"')
  }
  if (typeof defaultValue.value === 'object' && defaultValue.value.toString) {
    return defaultValue.value.toString()
  }
  return defaultValue.value
}

export const Prop = ({ propName, prop, getPropType }) => {
  const [showing, setShowing] = useState(false)
  if (!prop.type && !prop.flowType) return null

  const toggle = () => setShowing(s => !s)
  return (
    <div sx={styles.line} data-testid="prop">
      <div sx={styles.content}>
        <div sx={styles.propName} data-testid="prop-name">
          {propName}
        </div>
        <div sx={styles.propType} data-testid="prop-type">
          {getPropType(prop)}
        </div>
        {prop.defaultValue && (
          <div sx={styles.defaultValue} data-testid="prop-default-value">
            <em>{getDefaultValue(prop)}</em>
          </div>
        )}
        <div sx={styles.right}>
          {prop.required && (
            <div sx={styles.propRequired} data-testid="prop-required">
              <strong>required</strong>
            </div>
          )}
          {prop.description && (
            <button
              sx={styles.openDescBtn}
              onClick={toggle}
              data-testid="prop-toggle-description"
            >
              {showing ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
      </div>
      {showing && prop.description && (
        <div sx={styles.description} data-testid="prop-description">
          {prop.description}
        </div>
      )}
    </div>
  )
}

export const Props = ({ props, getPropType }) => {
  const entries = Object.entries(props)

  return (
    <div sx={styles.container} data-testid="props">
      {entries.map(([key, prop]) => (
        <Prop key={key} propName={key} prop={prop} getPropType={getPropType} />
      ))}
    </div>
  )
}
