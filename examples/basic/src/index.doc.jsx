import React from 'react'
import { doc } from 'docz'

doc('Getting Started')
  .order(1)
  .route('/')
  .section(() => <div>This is just the Home!</div>)
