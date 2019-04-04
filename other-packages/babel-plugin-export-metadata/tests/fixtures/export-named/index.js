/* ExportNamedDeclaration with Specifiers */
let foo = 5
let bar = () => {}
let baz = 'baz'
export { foo as default, bar as foobar, baz }

/* ExportNamedDeclaration with Variable declarations */
export let foo1 = 5,
  bar1 = () => {}

/* ExportNamedDeclaration with Function and Class declarations */
export function foo2() {}
export class Bar2 {}
