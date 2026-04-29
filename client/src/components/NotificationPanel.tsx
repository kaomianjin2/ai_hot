import type { NotificationEvent } from '../types/domain';

type NotificationPanelProps = {
  notifications: NotificationEvent[];
  unreadCount: number;
  isMarkAllPending: boolean;
  pendingNotificationIds: string[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
};

function formatNotificationTime(createdAt: string) {
  return new Date(createdAt).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function NotificationPanel({
  notifications,
  unreadCount,
  isMarkAllPending,
  pendingNotificationIds,
  onMarkAllRead,
  onMarkRead,
}: NotificationPanelProps) {
  const isAnyNotificationPending = pendingNotificationIds.length > 0;

  return (
    <section
      aria-labelledby="通知中心-title"
      className="notification-panel"
      id="notification-panel"
      role="region"
    >
      <div className="notification-header">
        <div>
          <h2 className="section-title" id="通知中心-title">
            ⌁ 通知中心
          </h2>
          <p className="notification-subtitle">集中查看扫描命中通知，并同步已读状态。</p>
        </div>
        <div className="notification-panel__header-meta">
          <span>
            {notifications.length} 条通知 · {unreadCount} 条未读
          </span>
          <button
            className="notification-panel__action"
            disabled={unreadCount === 0 || isMarkAllPending || isAnyNotificationPending}
            type="button"
            onClick={onMarkAllRead}
          >
            {isMarkAllPending ? '处理中…' : '全部已读'}
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <p className="empty-state visible">暂无通知，后续命中监控条件后会在这里显示。</p>
      ) : (
        <ul className="notification-list" aria-label="通知列表">
          {notifications.map((notification) => {
            const isMarkingCurrent = pendingNotificationIds.includes(notification.id);

            return (
              <li className="notification-list__item" key={notification.id}>
                <div className="notification-list__content">
                  <div className="notification-list__meta">
                    <span className="notification-list__status" data-read={notification.read}>
                      {notification.read ? '已读' : '未读'}
                    </span>
                    <span className="notification-list__time">
                      {formatNotificationTime(notification.createdAt)}
                    </span>
                  </div>
                  <h3 className="notification-list__title">{notification.title}</h3>
                  <p className="notification-list__reason">{notification.reason}</p>
                </div>
                <button
                  className="notification-panel__action notification-panel__action--item"
                  disabled={notification.read || isAnyNotificationPending || isMarkAllPending}
                  type="button"
                  onClick={() => onMarkRead(notification.id)}
                >
                  {isMarkingCurrent ? '处理中…' : notification.read ? '已读' : '标为已读'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
