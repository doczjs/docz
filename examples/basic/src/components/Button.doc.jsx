import React from 'react'
import { doc } from 'docz'
import { render } from 'docz-react'

import { Button } from './Button'

doc('Button')
  .category('Components')
  .section(render(() => <Button>Click me</Button>))
