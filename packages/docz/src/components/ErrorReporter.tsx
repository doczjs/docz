import * as React from 'react'
import { SFC } from 'react'

interface ErrorInfo {
  componentStack: string
}

export interface ErrorReporterProps {
  error: Error
  errorInfo: ErrorInfo | null
}

export const ErrorReporter: SFC<ErrorReporterProps> = ({
  error,
  errorInfo,
}) => (
  <div>
    <p>An error occurred while rendering this component:</p>
    <p>{error.message}</p>
    {errorInfo && <pre>{errorInfo.componentStack}</pre>}
  </div>
)
