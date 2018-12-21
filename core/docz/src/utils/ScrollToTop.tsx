import { ReactNode, Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

type ScrollToTopProps = RouteComponentProps<any>

class ScrollToTopBase extends Component<ScrollToTopProps> {
  public componentDidUpdate(prevProps: ScrollToTopProps): void {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  public render(): ReactNode {
    return this.props.children
  }
}

export const ScrollToTop: any = withRouter(ScrollToTopBase as any)
