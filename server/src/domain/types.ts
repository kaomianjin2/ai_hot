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

export type CreateHotItemInput = Omit<HotItem, 'id' | 'discoveredAt'>;

export type MonitorKeyword = {
  id: string;
  text: string;
  active: boolean;
  hitCount: number;
  createdAt: string;
};

export type CreateMonitorKeywordInput = Omit<MonitorKeyword, 'id' | 'hitCount' | 'createdAt'>;

export type NotificationEvent = {
  id: string;
  hotItemId: string;
  title: string;
  reason: string;
  read: boolean;
  createdAt: string;
};

export type CreateNotificationEventInput = Omit<NotificationEvent, 'id' | 'read' | 'createdAt'>;

export type ScanStatus = 'idle' | 'running' | 'succeeded' | 'failed';

export type ScanSummary = {
  id: string;
  status: ScanStatus;
  startedAt: string;
  completedAt?: string;
  discoveredCount: number;
  matchedCount: number;
  errorMessage?: string;
};

export type CreateScanSummaryInput = Omit<ScanSummary, 'id' | 'completedAt' | 'discoveredCount' | 'matchedCount' | 'errorMessage'>;
