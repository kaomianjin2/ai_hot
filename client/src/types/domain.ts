export type HotItem = {
  id: string;
  source: string;
  title: string;
  summary: string;
  url: string;
  tags: string[];
  heatScore: number;
  relevanceScore: number;
  publishedAt: string;
  discoveredAt: string;
};

export type MonitorKeyword = {
  id: string;
  text: string;
  active: boolean;
  hitCount: number;
  createdAt: string;
};

export type NotificationEvent = {
  id: string;
  hotItemId: string;
  title: string;
  reason: string;
  read: boolean;
  createdAt: string;
};

export type ScanStatus = "idle" | "running" | "succeeded" | "failed";

export type ScanSummary = {
  id: string;
  status: ScanStatus;
  startedAt: string;
  completedAt?: string;
  discoveredCount: number;
  matchedCount: number;
  errorMessage?: string;
};

export type HotItemFilters = {
  searchText: string;
  sources: string[];
  tags: string[];
  minHeatScore?: number;
};
