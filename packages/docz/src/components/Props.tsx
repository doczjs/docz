import { useStore } from "..";

export function Props({ of: component }: any) {
  const store = useStore();
  const props = store.props.find(
    (i) => i.key === component?.__filemeta.filepath
  );
  const found = props?.value?.[0].props;
  return (
    <div>
      {Object.keys(found).map((key) => {
        const item = found[key];
        return (
          <div key={key}>
            {key}: {item.type?.name}
          </div>
        );
      })}
    </div>
  );
}
