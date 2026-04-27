import type { Database } from 'better-sqlite3';

export function initDb(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS hot_items (
      id TEXT NOT NULL PRIMARY KEY,
      source TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      url TEXT NOT NULL,
      tags TEXT NOT NULL,
      heat_score INTEGER NOT NULL,
      relevance_score INTEGER NOT NULL,
      published_at TEXT NOT NULL,
      discovered_at TEXT NOT NULL
    ) STRICT;

    CREATE TABLE IF NOT EXISTS monitor_keywords (
      id TEXT NOT NULL PRIMARY KEY,
      text TEXT NOT NULL UNIQUE,
      active INTEGER NOT NULL DEFAULT 1,
      hit_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    ) STRICT;

    CREATE TABLE IF NOT EXISTS notification_events (
      id TEXT NOT NULL PRIMARY KEY,
      hot_item_id TEXT NOT NULL REFERENCES hot_items(id),
      title TEXT NOT NULL,
      reason TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    ) STRICT;

    CREATE TABLE IF NOT EXISTS scan_summaries (
      id TEXT NOT NULL PRIMARY KEY,
      status TEXT NOT NULL,
      started_at TEXT NOT NULL,
      completed_at TEXT,
      discovered_count INTEGER NOT NULL DEFAULT 0,
      matched_count INTEGER NOT NULL DEFAULT 0,
      error_message TEXT
    ) STRICT;
  `);
}
