import type { ReactNode } from "react";

type TopbarProps = {
  brand: string;
  statusLabel: string;
  actionSlot?: ReactNode;
};

export function Topbar({ brand, statusLabel, actionSlot }: TopbarProps) {
  return (
    <header className="topbar" aria-label="应用顶部栏">
      <div className="topbar__brand">
        <span className="topbar__mark" aria-hidden="true">
          AI
        </span>
        <div>
          <p className="topbar__eyebrow">Hot Radar</p>
          <h1 className="topbar__title">{brand}</h1>
        </div>
      </div>
      <div className="topbar__side">
        <span className="topbar__status">{statusLabel}</span>
        {actionSlot ? <div className="topbar__actions">{actionSlot}</div> : null}
      </div>
    </header>
  );
}
