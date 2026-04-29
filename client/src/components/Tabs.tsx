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
    <nav aria-label="主功能切换" className="tabs" role="tablist">
      {items.map((item) => {
        const isActive = item.id === activeId;
        const tabId = `tab-${item.id}`;
        const panelId = `panel-${item.id}`;

        return (
          <button
            aria-controls={panelId}
            aria-selected={isActive}
            className={`tab${isActive ? ' active' : ''}`}
            id={tabId}
            key={item.id}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            type="button"
            onClick={() => onChange(item.id)}
          >
            <span>{item.label}</span>
            {typeof item.count === 'number' ? <span className="tab-count">{item.count}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}
