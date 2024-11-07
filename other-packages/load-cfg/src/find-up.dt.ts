declare module 'find-up' {
  interface Options {
    cwd?: string
  }

  function findUp(
    filename: string | string[],
    options?: Options
  ): Promise<string | undefined>

  export function sync(
    filename: string | string[],
    options?: Options
  ): string | undefined
}
