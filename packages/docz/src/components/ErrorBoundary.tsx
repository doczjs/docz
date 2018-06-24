// Adapted from https://github.com/bvaughn/react-error-boundary/blob/master/src/ErrorBoundary.js

import * as React from 'react'
import { Component } from 'react'
import { ErrorReporter as DefaultErrorReporter } from './ErrorReporter'

interface ErrorInfo {
  componentStack: string
}

export interface ErrorBoundaryProps {
  ErrorReporter?: React.ComponentClass<any>
  onError?: (error: Error, componentStack: string) => void
}

export interface ErrorBoundaryState {
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state = {
    error: null,
    errorInfo: null,
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError = () => null } = this.props

    this.setState({ error, errorInfo }, () => {
      if (typeof onError === 'function') {
        try {
          onError.call(this, error, errorInfo ? errorInfo.componentStack : '')
        } catch (onErrorError) {
          console.warn('The supplied onError function threw and error:')
          console.warn(onErrorError)
        }
      }
    })
  }

  public render(): React.ReactNode {
    const { children, ErrorReporter = DefaultErrorReporter } = this.props
    const { error, errorInfo } = this.state

    if (error !== null) {
      console.error(error)
      return <ErrorReporter error={error} errorInfo={errorInfo} />
    }

    return children
  }
}
