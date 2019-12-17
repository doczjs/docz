import crossSpawn from 'cross-spawn'

export const spawnSync = (command: string, args?: readonly string[]) => {
  const { status } = crossSpawn.sync(command, args, {
    stdio: 'inherit',
  })

  if (status !== 0) {
    process.exitCode = status || 1
  }
}
