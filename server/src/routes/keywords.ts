import { FastifyInstance } from 'fastify';
import { getDb } from '../db/client.js';
import type { MonitorKeyword } from '../domain/types.js';

type KeywordRow = {
  id: string;
  text: string;
  active: number;
  hit_count: number;
  created_at: string;
};

function rowToKeyword(row: KeywordRow): MonitorKeyword {
  return {
    id: row.id,
    text: row.text,
    active: row.active === 1,
    hitCount: row.hit_count,
    createdAt: row.created_at,
  };
}

export async function keywordsRoutes(app: FastifyInstance) {
  app.get('/api/keywords', async (_req, reply) => {
    const db = getDb();
    const rows = db
      .prepare('SELECT * FROM monitor_keywords ORDER BY created_at DESC')
      .all() as KeywordRow[];
    return reply.send(rows.map(rowToKeyword));
  });

  app.post<{ Body: { text: string; active: boolean } }>(
    '/api/keywords',
    async (req, reply) => {
      const { text, active } = req.body;
      const db = getDb();

      const existing = db
        .prepare('SELECT id FROM monitor_keywords WHERE text = ?')
        .get(text);
      if (existing) return reply.code(409).send({ error: 'Keyword already exists' });

      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      db.prepare(
        'INSERT INTO monitor_keywords (id, text, active, hit_count, created_at) VALUES (?, ?, ?, ?, ?)'
      ).run(id, text, active ? 1 : 0, 0, createdAt);

      const keyword: MonitorKeyword = {
        id,
        text,
        active,
        hitCount: 0,
        createdAt,
      };
      return reply.code(201).send(keyword);
    }
  );

  app.patch<{ Params: { id: string }; Body: { text?: string; active?: boolean } }>(
    '/api/keywords/:id',
    async (req, reply) => {
      const { id } = req.params;
      const db = getDb();

      const existing = db
        .prepare('SELECT * FROM monitor_keywords WHERE id = ?')
        .get(id) as KeywordRow | undefined;
      if (!existing) return reply.code(404).send({ error: 'Keyword not found' });

      const { text, active } = req.body;
      const newText = text ?? existing.text;
      const newActive = active !== undefined ? (active ? 1 : 0) : existing.active;

      db.prepare(
        'UPDATE monitor_keywords SET text = ?, active = ? WHERE id = ?'
      ).run(newText, newActive, id);

      const updated: MonitorKeyword = {
        id: existing.id,
        text: newText,
        active: newActive === 1,
        hitCount: existing.hit_count,
        createdAt: existing.created_at,
      };
      return reply.send(updated);
    }
  );

  app.delete<{ Params: { id: string } }>(
    '/api/keywords/:id',
    async (req, reply) => {
      const { id } = req.params;
      const db = getDb();

      const existing = db
        .prepare('SELECT id FROM monitor_keywords WHERE id = ?')
        .get(id);
      if (!existing) return reply.code(404).send({ error: 'Keyword not found' });

      db.prepare('DELETE FROM monitor_keywords WHERE id = ?').run(id);
      return reply.code(204).send();
    }
  );
}
