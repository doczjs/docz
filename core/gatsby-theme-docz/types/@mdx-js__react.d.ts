declare module '@mdx-js/react' {
  export const MDXContext: React.ContextType<any>
  export const MDXProvider: React.FunctionComponent<any>
  export function useMDXComponents(components: []): []
  export function withMDXComponents(Component: any): React.FunctionComponent

  export function mdx(type: string | any, props: any): any
}
