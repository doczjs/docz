import React from 'react'
import { doc } from 'docz'

doc('Overview')
  .order(1)
  .route('/')
  .section(() => <div>This is just the Home!</div>)
