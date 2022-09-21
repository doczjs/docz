import type { ReactNode } from "react";

const KINDS = {
  info: "#5352ED",
  positive: "#2ED573",
  negative: "#FF4757",
  warning: "#FFA502",
};

export type AlertProps = {
  kind: "info" | "success" | "error" | "warning";
  children: ReactNode;
};

export function Alert({ children, kind = "info", ...rest }: AlertProps) {
  return (
    <div
      style={{
        padding: 20,
        background: "white",
        borderRadius: 3,
        color: "white",
        backgroundColor: KINDS[kind],
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
