import type { FastifyPluginAsync } from 'fastify';
import { getDb } from '../db/client.js';
import { runScan } from '../services/scanner.js';
import type { ScanSummary } from '../domain/types.js';

type ScanSummaryRow = {
  id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  discovered_count: number;
  matched_count: number;
  error_message: string | null;
};

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

export const scansRoutes: FastifyPluginAsync = async (app) => {
  app.post('/api/scans/run', async (_request, reply) => {
    const summary = runScan();
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
