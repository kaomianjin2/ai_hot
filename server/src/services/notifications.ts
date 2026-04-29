import { getDb } from '../db/client.js';
import type { NotificationEvent } from '../domain/types.js';

type DbRow = {
  id: string;
  hot_item_id: string;
  title: string;
  reason: string;
  read: number;
  created_at: string;
};

function rowToNotification(row: DbRow): NotificationEvent {
  return {
    id: row.id,
    hotItemId: row.hot_item_id,
    title: row.title,
    reason: row.reason,
    read: row.read === 1,
    createdAt: row.created_at,
  };
}

export function getNotifications(options?: { unreadOnly?: boolean }): NotificationEvent[] {
  const db = getDb();
  const sql = options?.unreadOnly
    ? 'SELECT * FROM notification_events WHERE read = 0 ORDER BY created_at DESC'
    : 'SELECT * FROM notification_events ORDER BY created_at DESC';

  const rows = db.prepare(sql).all() as DbRow[];
  return rows.map(rowToNotification);
}

export function markAsRead(id: string): boolean {
  const db = getDb();
  const result = db
    .prepare('UPDATE notification_events SET read = 1 WHERE id = ? AND read = 0')
    .run(id);
  return result.changes > 0;
}

export function markAllAsRead(): number {
  const db = getDb();
  const result = db
    .prepare('UPDATE notification_events SET read = 1 WHERE read = 0')
    .run();
  return result.changes;
}
