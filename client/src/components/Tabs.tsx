type TabItem = {
  id: string;
  label: string;
  count?: number;
};

type TabsProps = {
  items: TabItem[];
  activeId: string;
  onChange: (nextId: string) => void;
};

export function Tabs({ items, activeId, onChange }: TabsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="内容分组">
      <ul className="tabs" role="tablist">
        {items.map((item) => {
          const isActive = item.id === activeId;
          const tabId = `tab-${item.id}`;
          const panelId = `panel-${item.id}`;

          return (
            <li className="tabs__item" key={item.id}>
              <button
                aria-controls={panelId}
                aria-selected={isActive}
                className="tabs__button"
                id={tabId}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => onChange(item.id)}
              >
                <span>{item.label}</span>
                {typeof item.count === "number" ? (
                  <span className="tabs__count">{item.count}</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
