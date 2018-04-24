import React, { Fragment } from 'react'
import { doc } from 'docz'
import { render } from 'docz-react'

import { Alert } from './Alert'

doc('Alert')
  .category('Components')
  .section('Basic usage', render(() => <Alert>Some message</Alert>))
  .section(
    'Using different kinds',
    render(() => (
      <Fragment>
        <Alert>Some message</Alert>
        <Alert kind="positive">Some message</Alert>
        <Alert kind="negative">Some message</Alert>
        <Alert kind="warning">Some message</Alert>
      </Fragment>
    ))
  )
