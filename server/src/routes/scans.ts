import type { FastifyPluginAsync } from 'fastify';
import { getDb } from '../db/client.js';
import { runScan, rowToScanSummary, type ScanSummaryRow } from '../services/scanner.js';
import { createRssAdapter } from '../sources/rss.js';
import { createGithubAdapter } from '../sources/github.js';

export const scansRoutes: FastifyPluginAsync = async (app) => {
  app.post('/api/scans/run', async (_request, reply) => {
    const rssAdapter = createRssAdapter();
    const githubAdapter = createGithubAdapter();
    const summary = await runScan([rssAdapter, githubAdapter]);
    return reply.status(201).send(summary);
  });

  app.get('/api/scans', async (_request, reply) => {
    const db = getDb();
    const rows = db.prepare(
      'SELECT * FROM scan_summaries ORDER BY started_at DESC'
    ).all() as ScanSummaryRow[];

    return reply.send(rows.map(rowToScanSummary));
  });
};
