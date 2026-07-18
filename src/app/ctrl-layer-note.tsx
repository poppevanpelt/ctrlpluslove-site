import type React from "react";

type CtrlLayerNoteProps = {
  children: React.ReactNode;
  className?: string;
};

export function CtrlLayerNote({ children, className }: CtrlLayerNoteProps) {
  return (
    <span
      aria-hidden="true"
      className={["ctrl-layer-note", className].filter(Boolean).join(" ")}
    >
      {children}
    </span>
  );
}
