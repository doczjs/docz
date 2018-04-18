import React from 'react'
import { doc } from 'docz'

import { Button } from './Button'
import { components } from './'

doc('Button')
  .group(components)
  .section(() => <Button>Click me</Button>)
