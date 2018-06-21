// Adapted from https://github.com/bvaughn/react-error-boundary/blob/master/src/ErrorBoundary.js

import * as React from 'react'
import * as DefaultErrorReporter from './ErrorReporter'

interface ErrorInfo {
  componentStack: string
}

type ErrorBoundaryProps = {
  ErrorReporter?: React.ComponentClass<any>
  onError?: (error: Error, componentStack: string) => void
} & Partial<DefaultProps>

export interface ErrorBoundaryState {
  error: Error | null
  errorInfo: ErrorInfo | null
}

type DefaultProps = Readonly<typeof defaultProps>

const defaultProps = {
  onError: () => {},
  ErrorReporter: DefaultErrorReporter,
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public static defaultProps = defaultProps

  public state = {
    error: null,
    errorInfo: null,
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo }, () => {
      if (typeof this.props.onError === 'function') {
        try {
          this.props.onError.call(
            this,
            error,
            errorInfo ? errorInfo.componentStack : ''
          )
        } catch (onErrorError) {
          console.warn('The supplied onError function threw and error:')
          console.warn(onErrorError)
        }
      }
    })
  }

  public render() {
    const { children, ErrorReporter } = this.props
    const { error, errorInfo } = this.state

    if (error !== null) {
      console.log(error)
      return <ErrorReporter error={error} errorInfo={errorInfo} />
    }

    return children
  }
}

export default ErrorBoundary
