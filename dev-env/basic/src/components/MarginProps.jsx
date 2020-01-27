import React from 'react'
import t from 'prop-types'
//@ts-ignore do not remove this to get live-reloading from changes made in packages
import ChangesWhenAPackageSourceIsEdited from '../last-change-timestamp' // eslint-disable-line no-unused-vars


export const marginPropTypes = {
  margin: t.oneOfType([t.number, t.string]),
  marginTop: t.oneOfType([t.number, t.string]),
  marginBottom: t.oneOfType([t.number, t.string]),
  marginLeft: t.oneOfType([t.number, t.string]),
  marginRight: t.oneOfType([t.number, t.string]),
  marginX: t.oneOfType([t.number, t.string]),
  marginY: t.oneOfType([t.number, t.string]),
}

export const MarginProps = props => <div {...props} />

MarginProps.propTypes = marginPropTypes
