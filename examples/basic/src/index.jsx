import React from 'react'
import { doc } from 'docz'

doc('Home')
  .route('/')
  .order(1)
  .section(() => <div>This is home</div>)
