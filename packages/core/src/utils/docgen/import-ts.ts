export function importTs() {
  return (async () => (await import('typescript')).default)();
}
