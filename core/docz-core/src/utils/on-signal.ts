export const onSignal = (cb: () => any) => {
  const signals: any = ['SIGINT', 'SIGTERM']
  for (const sig of signals) {
    process.on(sig, async () => {
      await cb()
      process.exit()
    })
  }
}
