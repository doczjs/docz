// Adapted from https://github.com/bvaughn/react-error-boundary/blob/master/src/ErrorBoundary.js

import * as React from 'react'
import * as DefaultErrorReporter from './ErrorReporter'

type ErrorInfo = {
  componentStack: string,
}

type ErrorBoundaryProps = {
  ErrorReporter?: React.ComponentClass<any>,
  onError?: (error: Error, componentStack: string) => void,
} & Partial<DefaultProps>

export interface ErrorBoundaryState {
  error: Error | null,
  errorInfo: ErrorInfo | null,
}

type DefaultProps = Readonly<typeof defaultProps>

const defaultProps = {
  onError: () => {},
  ErrorReporter: DefaultErrorReporter
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static defaultProps = defaultProps

  state = {
    error: null,
    errorInfo: null
  }

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		this.setState({ error, errorInfo }, () => {
			if (typeof this.props.onError === 'function') {
			try {
				this.props.onError.call(this, error, errorInfo ? errorInfo.componentStack : '')
			} catch (onErrorError) {
				console.warn('The supplied onError function threw and error:')
				console.warn(onErrorError)
			}
		}
		})
  }

  render() {
    const { children } = this.props
    const { error  } = this.state

    if (error !== null) {
      console.log(error)
      return (
        <div>
          <p>An error occurred while rendering this component:</p>
          {/* <p>{error.message}</p>
          <pre>{errorInfo.componentStack}</pre> */}
        </div>
      )
      // return (
      //   <ErrorReporter
      //     error={error}
      //     errorInfo={errorInfo}
      //   />
      // )
    }

    return children
  }
}

export default ErrorBoundary
