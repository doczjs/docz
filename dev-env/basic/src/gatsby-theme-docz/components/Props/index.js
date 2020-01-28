import React from 'react'
import { Props as OriginalProps } from 'gatsby-theme-docz/src/components/Props/index'
import { useComponentProps } from 'docz'

export const Props = ({ props, ...others}) => {
  const marginProps = useComponentProps({ componentName: 'MarginProps' })
  const marginKeys = Object.keys(marginProps)
  const systemCategoryAvailables = []

  const displayedProps = Object.keys(props).reduce((object, key) => {
    if (!marginKeys.includes(key)) {
      object[key] = props[key]
      if (!systemCategoryAvailables.includes('margin')) {
        systemCategoryAvailables.push('margin')
      }
    }
    return object
  }, {})

  return (
    <div>
      {systemCategoryAvailables.length > 0 && (
        <div>
          The following system props are available on this components:
          {systemCategoryAvailables.map((category) =>
            <div>{category}</div>
          )}
        </div>
      )}
      <OriginalProps props={displayedProps} {...others} />
    </div>
  )
}
