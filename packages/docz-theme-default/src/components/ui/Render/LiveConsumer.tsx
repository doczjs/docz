import { withLive } from 'react-live'

export const LiveConsumer = withLive<any>(({ live, children }) =>
  children(live)
)
