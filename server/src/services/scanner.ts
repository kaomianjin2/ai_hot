import { randomUUID } from 'crypto';
import { getDb } from '../db/client.js';
import type { ScanSummary } from '../domain/types.js';

type KeywordRow = {
  id: string;
  text: string;
};

type ScanSummaryRow = {
  id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  discovered_count: number;
  matched_count: number;
  error_message: string | null;
};

const MOCK_HOT_ITEMS = [
  {
    source: 'mock',
    title: 'ChatGPT 发布新版本，推理能力大幅提升',
    summary: 'OpenAI 宣布 ChatGPT 最新版本在数学和代码推理上取得突破性进展。',
    url: 'https://example.com/chatgpt-new-version',
    tags: ['AI', 'ChatGPT', 'OpenAI'],
    heatScore: 95,
    relevanceScore: 90,
  },
  {
    source: 'mock',
    title: 'GitHub Copilot 支持更多编程语言',
    summary: 'GitHub 宣布 Copilot 现已支持 20 余种编程语言，覆盖主流开发场景。',
    url: 'https://example.com/copilot-languages',
    tags: ['AI', 'GitHub', '编程'],
    heatScore: 80,
    relevanceScore: 75,
  },
  {
    source: 'mock',
    title: 'Google Gemini 模型开放 API 访问',
    summary: 'Google 正式开放 Gemini Ultra 模型的 API，供开发者集成到应用中。',
    url: 'https://example.com/gemini-api',
    tags: ['AI', 'Google', 'Gemini'],
    heatScore: 88,
    relevanceScore: 82,
  },
];

function rowToScanSummary(row: ScanSummaryRow): ScanSummary {
  return {
    id: row.id,
    status: row.status as ScanSummary['status'],
    startedAt: row.started_at,
    completedAt: row.completed_at ?? undefined,
    discoveredCount: row.discovered_count,
    matchedCount: row.matched_count,
    errorMessage: row.error_message ?? undefined,
  };
}

export function runScan(): ScanSummary {
  const db = getDb();
  const scanId = randomUUID();
  const startedAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO scan_summaries (id, status, started_at, discovered_count, matched_count)
    VALUES (?, 'running', ?, 0, 0)
  `).run(scanId, startedAt);

  try {
    const now = new Date().toISOString();

    for (const item of MOCK_HOT_ITEMS) {
      const itemId = randomUUID();
      db.prepare(`
        INSERT INTO hot_items (id, source, title, summary, url, tags, heat_score, relevance_score, published_at, discovered_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        itemId,
        item.source,
        item.title,
        item.summary,
        item.url,
        JSON.stringify(item.tags),
        item.heatScore,
        item.relevanceScore,
        now,
        now,
      );

      // 检查活跃关键词是否命中该热点标题
      const activeKeywords = db.prepare(
        'SELECT id, text FROM monitor_keywords WHERE active = 1'
      ).all() as KeywordRow[];

      for (const keyword of activeKeywords) {
        if (!item.title.includes(keyword.text)) continue;

        db.prepare(
          'UPDATE monitor_keywords SET hit_count = hit_count + 1 WHERE id = ?'
        ).run(keyword.id);

        db.prepare(`
          INSERT INTO notification_events (id, hot_item_id, title, reason, read, created_at)
          VALUES (?, ?, ?, ?, 0, ?)
        `).run(
          randomUUID(),
          itemId,
          item.title,
          `命中监控词：${keyword.text}`,
          now,
        );
      }
    }

    const matchedCount = (db.prepare(
      'SELECT COUNT(*) as count FROM notification_events WHERE created_at >= ?'
    ).get(startedAt) as { count: number }).count;

    const completedAt = new Date().toISOString();
    db.prepare(`
      UPDATE scan_summaries
      SET status = 'succeeded', completed_at = ?, discovered_count = ?, matched_count = ?
      WHERE id = ?
    `).run(completedAt, MOCK_HOT_ITEMS.length, matchedCount, scanId);

    const row = db.prepare('SELECT * FROM scan_summaries WHERE id = ?').get(scanId) as ScanSummaryRow;
    return rowToScanSummary(row);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    db.prepare(`
      UPDATE scan_summaries SET status = 'failed', error_message = ? WHERE id = ?
    `).run(errorMessage, scanId);

    const row = db.prepare('SELECT * FROM scan_summaries WHERE id = ?').get(scanId) as ScanSummaryRow;
    return rowToScanSummary(row);
  }
}
