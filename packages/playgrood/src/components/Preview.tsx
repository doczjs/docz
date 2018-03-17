import * as React from 'react'

import { IComponents } from '../utils/components'
import { PlaygroddContext } from '../components/Playgrodd'
import { AsyncRoute } from '../components/AsyncRoute'

export const Preview: React.SFC = () => (
  <PlaygroddContext.Consumer>
    {(components: IComponents) =>
      Object.values(components).map(component => (
        <AsyncRoute key={component.id} component={component} />
      ))
    }
  </PlaygroddContext.Consumer>
)
