import React from 'react'
import { Playground } from 'docz'

export default props => {
  return (
    <div style={{ background: 'rebeccapurple', padding: 12 }}>
      <Playground {...props} />
    </div>
  )
}
