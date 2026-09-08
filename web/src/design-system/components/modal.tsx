"use client";

import type { ReactNode } from "react";

import { Button } from "./ui";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <dialog className="ds-modal" open={open} aria-labelledby="ds-modal-title">
      <div className="ds-modal-panel">
        <div className="ds-modal-header">
          <h2 id="ds-modal-title" className="ds-modal-title">{title}</h2>
          <Button type="button" variant="quiet" aria-label="Close dialog" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="ds-modal-content">{children}</div>
      </div>
    </dialog>
  );
}
