export type PropsProps = {
  info: any;
};

export function Props({ info }: PropsProps) {
  return Object.keys(info).map((key) => {
    const item = info[key];
    return (
      <div key={key}>
        {key}: {item.type?.name}
      </div>
    );
  });
}
