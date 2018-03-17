import React from 'react'
import { Route } from 'react-router-dom'
import { IComponent } from '../utils/components'

export interface IAsyncRouteProps {
  component: IComponent
}

export interface IAsyncRouteState {
  render(): JSX.Element | null
}

export class AsyncRoute extends React.Component<
  IAsyncRouteProps,
  IAsyncRouteState
> {
  constructor(props: any, ctx: any) {
    super(props, ctx)

    this.state = {
      render: () => null,
    }
  }

  async componentDidMount() {
    const { name } = this.props.component
    const { importFn } = window.__PLAYGRODD_COMPONENTS__[`${name}`]
    const { doc: render } = await importFn

    this.setState({ render })
  }

  render() {
    return (
      <Route
        exact
        path={this.props.component.route}
        render={this.state.render}
      />
    )
  }
}
