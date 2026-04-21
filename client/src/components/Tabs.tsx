type TabItem = {
  id: string;
  label: string;
  count?: number;
};

type TabsProps = {
  items: TabItem[];
  activeId: string;
};

export function Tabs({ items, activeId }: TabsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="内容分组">
      <ul className="tabs">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li
              className="tabs__item"
              aria-current={isActive ? "page" : undefined}
              key={item.id}
            >
              <span>{item.label}</span>
              {typeof item.count === "number" ? (
                <span className="tabs__count">{item.count}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
