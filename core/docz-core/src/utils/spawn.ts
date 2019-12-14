import crossSpawn from 'cross-spawn'

export const spawnSync = (command: string, args?: readonly string[]) => {
  const output = crossSpawn.sync(command, args, {
    stdio: ['inherit', 'inherit', 'pipe'],
  })

  if (!output.stderr) {
    return
  }

  process.exitCode = output.status || 1
}
