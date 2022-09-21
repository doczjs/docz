export function Props({ of: component = {} }: any) {
  const { docgenInfo } = component.__filemeta;
  if (!docgenInfo) return null;
  return (
    <div>
      {Object.keys(docgenInfo?.props || {}).map((key) => {
        const item = docgenInfo?.props[key];
        return (
          <div key={key}>
            {key}: {item.type?.name}
          </div>
        );
      })}
    </div>
  );
}
