export function composeUtil(props: string[]) {
  return (value: string) =>
    props.reduce((obj, prop) => ({ ...obj, [prop]: value }), {});
}
