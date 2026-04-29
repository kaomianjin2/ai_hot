import type { ReactNode } from 'react';

type LayoutStat = {
  id: string;
  icon: string;
  label: string;
  value: string | number;
  tone?: 'cyan' | 'danger' | 'green';
};

type LayoutProps = {
  stats: LayoutStat[];
  topbar: ReactNode;
  tabs: ReactNode;
  children: ReactNode;
};

export function Layout({ stats, topbar, tabs, children }: LayoutProps) {
  return (
    <div className="page">
      <div className="shell">
        {topbar}
        {tabs}
        <section aria-label="热点统计" className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.id}>
              <div className="stat-label">
                <span aria-hidden="true">{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
              <div className={`stat-value${stat.tone ? ` ${stat.tone}` : ''}`}>{stat.value}</div>
            </article>
          ))}
        </section>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
