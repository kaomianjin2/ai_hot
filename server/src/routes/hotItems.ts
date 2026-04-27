import type { FastifyPluginAsync } from 'fastify';
import { randomUUID } from 'crypto';
import { getDb } from '../db/client.js';
import type { HotItem, CreateHotItemInput } from '../domain/types.js';

type DbRow = {
  id: string;
  source: string;
  title: string;
  summary: string;
  url: string;
  tags: string;
  heat_score: number;
  relevance_score: number;
  published_at: string;
  discovered_at: string;
};

function rowToHotItem(row: DbRow): HotItem {
  return {
    id: row.id,
    source: row.source,
    title: row.title,
    summary: row.summary,
    url: row.url,
    tags: JSON.parse(row.tags) as string[],
    heatScore: row.heat_score,
    relevanceScore: row.relevance_score,
    publishedAt: row.published_at,
    discoveredAt: row.discovered_at,
  };
}

export const hotItemsRoutes: FastifyPluginAsync = async (app) => {
  app.get<{
    Querystring: { source?: string; tag?: string; minHeat?: string };
  }>('/api/hot-items', async (request, reply) => {
    const db = getDb();
    const { source, tag, minHeat } = request.query;

    let sql = 'SELECT * FROM hot_items WHERE 1=1';
    const params: unknown[] = [];

    if (source) {
      sql += ' AND source = ?';
      params.push(source);
    }

    if (minHeat !== undefined) {
      const minHeatNum = Number(minHeat);
      sql += ' AND heat_score >= ?';
      params.push(minHeatNum);
    }

    sql += ' ORDER BY heat_score DESC';

    const rows = db.prepare(sql).all(...params) as DbRow[];
    const items = rows.map(rowToHotItem);

    // tag 过滤在内存中完成，因为 tags 是 JSON 字符串，SQLite LIKE 无法精确匹配数组元素
    if (tag) {
      const filtered = items.filter((item) => item.tags.includes(tag));
      return reply.send(filtered);
    }

    return reply.send(items);
  });

  app.get<{ Params: { id: string } }>('/api/hot-items/:id', async (request, reply) => {
    const db = getDb();
    const row = db.prepare('SELECT * FROM hot_items WHERE id = ?').get(request.params.id) as DbRow | undefined;

    if (!row) {
      return reply.status(404).send({ error: 'Not found' });
    }

    return reply.send(rowToHotItem(row));
  });

  app.post<{ Body: CreateHotItemInput }>('/api/hot-items', async (request, reply) => {
    const db = getDb();
    const input = request.body;
    const id = randomUUID();
    const discoveredAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO hot_items (id, source, title, summary, url, tags, heat_score, relevance_score, published_at, discovered_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      input.source,
      input.title,
      input.summary,
      input.url,
      JSON.stringify(input.tags),
      input.heatScore,
      input.relevanceScore,
      input.publishedAt,
      discoveredAt,
    );

    const created: HotItem = { ...input, id, discoveredAt };
    return reply.status(201).send(created);
  });
};
