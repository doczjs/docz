import * as React from 'react'
import { CSSProperties, Component, SFC } from 'react'

export interface StylesMap {
  [s: string]: CSSProperties
}
const styles: StylesMap = {
  wrapper: {
    overflowY: 'auto',
    padding: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    background: 'white',
    fontFamily: 'monospace',
    fontSize: '14px',
  },
  page: {
    maxWidth: 960,
  },
  title: {
    margin: '0 0 30px',
  },
  subtitle: {
    margin: '30px 0 10px',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
  },
}

const ErrorReporter: SFC<ErrorBoundaryRP> = ({ error, componentStack }) => (
  <div style={styles.wrapper}>
    <div style={styles.page}>
      <h1 style={styles.title}>🚨 Whoops, we crashed 🚨</h1>
      {error && <div>{error.message}</div>}
      <h2 style={styles.subtitle}>Stack trace</h2>
      {componentStack && (
        <p style={styles.stack}>
          {componentStack.split('\n').map(str => <div>{str}</div>)}
        </p>
      )}
    </div>
  </div>
)

export interface ErrorBoundaryRP {
  error?: Error | null
  componentStack?: string | null
}

export class ErrorBoundary extends Component<{}, ErrorBoundaryRP> {
  public state = {
    error: null,
    componentStack: null,
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.setState({ error, componentStack: info ? info.componentStack : null })
  }

  public render(): React.ReactNode {
    const { children } = this.props
    const { error } = this.state

    return error !== null ? <ErrorReporter {...this.state} /> : children
  }
}
