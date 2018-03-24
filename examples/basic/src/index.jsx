import React from 'react'
import { doc } from 'playgrodd'

doc('Home')
  .route('/')
  .order(1)
  .section(() => <div>This is home</div>)
