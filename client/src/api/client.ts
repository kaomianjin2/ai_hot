import type { HotItem, MonitorKeyword, ScanSummary } from '../types/domain';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options);

  if (!response.ok) {
    throw new Error(`API ${response.status} ${response.statusText}: ${path}`);
  }

  return response.json() as Promise<T>;
}

export function fetchHotItems(params?: {
  source?: string;
  tag?: string;
  minHeat?: number;
}): Promise<HotItem[]> {
  if (!params) return apiFetch<HotItem[]>('/api/hot-items');

  const searchParams = new URLSearchParams();

  if (params.source !== undefined) searchParams.set('source', params.source);
  if (params.tag !== undefined) searchParams.set('tag', params.tag);
  if (params.minHeat !== undefined) searchParams.set('minHeat', String(params.minHeat));

  const query = searchParams.toString();
  const url = query ? `/api/hot-items?${query}` : '/api/hot-items';

  return apiFetch<HotItem[]>(url);
}

export function fetchHotItem(id: string): Promise<HotItem> {
  return apiFetch<HotItem>(`/api/hot-items/${id}`);
}

export function fetchKeywords(): Promise<MonitorKeyword[]> {
  return apiFetch<MonitorKeyword[]>('/api/keywords');
}

export function addKeyword(text: string): Promise<MonitorKeyword> {
  return apiFetch<MonitorKeyword>('/api/keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, active: true }),
  });
}

export function updateKeyword(
  id: string,
  data: { text?: string; active?: boolean }
): Promise<MonitorKeyword> {
  return apiFetch<MonitorKeyword>(`/api/keywords/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function runScan(): Promise<ScanSummary> {
  return apiFetch<ScanSummary>('/api/scans/run', { method: 'POST' });
}

export function fetchScans(): Promise<ScanSummary[]> {
  return apiFetch<ScanSummary[]>('/api/scans');
}
