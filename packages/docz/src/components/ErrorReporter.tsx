import * as React from 'react'
import { SFC } from 'react'

interface ErrorInfo {
  componentStack: string
}

export interface ErrorReporterProps {
  error: Error
  errorInfo: ErrorInfo
}

const ErrorReporter: SFC<ErrorReporterProps> = ({ error, errorInfo }) => {
  return (
    <div>
      <p>An error occurred while rendering this component:</p>
      <p>{error.message}</p>
      <pre>{errorInfo.componentStack}</pre>
    </div>
  )
}

export default ErrorReporter
