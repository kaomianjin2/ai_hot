import type { ReactNode } from "react";

type LayoutProps = {
  topbar: ReactNode;
  tabs: ReactNode;
  children: ReactNode;
};

export function Layout({ topbar, tabs, children }: LayoutProps) {
  return (
    <div className="radar-layout">
      {topbar}
      <div className="radar-layout__tabs">{tabs}</div>
      <main className="radar-layout__main">{children}</main>
    </div>
  );
}
