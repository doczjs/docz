import { useStore } from "..";

export function Props({ of: component = {} }: any) {
  const store = useStore();
  const { filepath, displayName } = component.__filemeta;
  const props = store.props.find((i) => i.key === filepath);
  const found = props?.value.find((i) => i.displayName === displayName);
  return (
    <div>
      {Object.keys(found?.props || {}).map((key) => {
        const item = found?.props[key];
        return (
          <div key={key}>
            {key}: {item.type?.name}
          </div>
        );
      })}
    </div>
  );
}
