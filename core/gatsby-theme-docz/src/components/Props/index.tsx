/** @jsx jsx */
import { jsx } from 'theme-ui'
import React, { useState } from 'react'

import { ChevronDown, ChevronUp } from 'react-feather'
import * as styles from './styles'
import { Prop as PropProps, PropsComponentProps } from 'docz'

export interface PropComponentProps {
  propName: string
  prop: PropProps
  getPropType(props: PropProps): string | null
}

export function getDefaultValue({ defaultValue, type, flowType }: PropProps) {
  const propType = flowType ? flowType : type
  if (!defaultValue) return null
  if (defaultValue.value === "''") {
    return '[Empty string]'
  }
  if (propType && propType.name === 'string') {
    return defaultValue.value.replace(/\'/g, '"')
  }
  return defaultValue.value
}

export const Prop: React.FunctionComponent<PropComponentProps> = ({
  propName,
  prop,
  getPropType,
}) => {
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

export const Props: React.FunctionComponent<PropsComponentProps> = ({
  props,
  getPropType,
}) => {
  const entries = Object.entries(props)

  return (
    <div sx={styles.container} data-testid="props">
      {entries.map(([key, prop]) => (
        <Prop key={key} propName={key} prop={prop} getPropType={getPropType} />
      ))}
    </div>
  )
}
