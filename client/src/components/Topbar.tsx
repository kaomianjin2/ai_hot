type TopbarProps = {
  brand: string;
  subtitle: string;
  unreadCount: number;
  isNotificationPanelOpen: boolean;
  isScanning: boolean;
  onToggleNotifications: () => void;
  onStartScan: () => void;
};

export function Topbar({
  brand,
  subtitle,
  unreadCount,
  isNotificationPanelOpen,
  isScanning,
  onToggleNotifications,
  onStartScan,
}: TopbarProps) {
  const bellBadgeText = unreadCount > 9 ? '9+' : unreadCount.toString();

  return (
    <header className="topbar" aria-label="顶部导航">
      <div className="brand">
        <div aria-hidden="true" className="brand-icon">
          ⌁
        </div>
        <div>
          <h1>{brand}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="top-actions">
        <button
          aria-label="立即扫描"
          className="scan-button"
          disabled={isScanning}
          type="button"
          onClick={onStartScan}
        >
          ↻ {isScanning ? '扫描中…' : '立即扫描'}
        </button>
        <button
          aria-controls="notification-panel"
          aria-expanded={isNotificationPanelOpen}
          aria-label={`通知中心，当前 ${unreadCount} 条未读`}
          className="bell-button"
          type="button"
          onClick={onToggleNotifications}
        >
          <span aria-hidden="true">⌁</span>
          {unreadCount > 0 ? <span className="bell-badge">{bellBadgeText}</span> : null}
        </button>
      </div>
    </header>
  );
}
