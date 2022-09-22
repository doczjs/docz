import type { ReactNode } from "react";

export type PlaygroundProps = {
  children: ReactNode;
  code: string;
};

export function Playground({ children, code }: PlaygroundProps) {
  return (
    <div>
      {children}
      {code}
    </div>
  );
}
