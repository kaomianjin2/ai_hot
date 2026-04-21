import type {
  HotItem,
  HotItemFilters,
  MonitorKeyword,
  NotificationEvent,
  ScanSummary,
} from "../types/domain";

export const mockHotItems: HotItem[] = [
  {
    id: "hot-001",
    source: "GitHub",
    title: "Open-source agent benchmark adds browser task coverage",
    summary:
      "A new benchmark suite expands agent evaluation with browser workflows, repository edits, and reproducible scoring.",
    url: "https://example.com/github-agent-benchmark",
    tags: ["agent", "benchmark", "browser"],
    heatScore: 92,
    relevanceScore: 88,
    publishedAt: "2026-04-21T05:20:00.000Z",
    discoveredAt: "2026-04-21T05:34:12.000Z",
  },
  {
    id: "hot-002",
    source: "RSS",
    title: "AI coding assistants shift toward project-level planning",
    summary:
      "Developer tools are adding stronger planning, review, and verification loops for multi-file application changes.",
    url: "https://example.com/ai-coding-planning",
    tags: ["coding", "planning", "developer-tools"],
    heatScore: 76,
    relevanceScore: 81,
    publishedAt: "2026-04-20T22:10:00.000Z",
    discoveredAt: "2026-04-21T01:18:45.000Z",
  },
  {
    id: "hot-003",
    source: "RSS",
    title: "Small model release notes see limited traction",
    summary:
      "A niche model update has low discussion volume but remains relevant for teams tracking inference cost trends.",
    url: "https://example.com/small-model-release-notes",
    tags: ["models", "cost"],
    heatScore: 18,
    relevanceScore: 64,
    publishedAt: "2026-04-19T16:45:00.000Z",
    discoveredAt: "2026-04-20T03:02:09.000Z",
  },
];

export const mockMonitorKeywords: MonitorKeyword[] = [
  {
    id: "keyword-001",
    text: "agent benchmark",
    active: true,
    hitCount: 14,
    createdAt: "2026-04-15T08:00:00.000Z",
  },
  {
    id: "keyword-002",
    text: "developer tools",
    active: true,
    hitCount: 9,
    createdAt: "2026-04-16T09:30:00.000Z",
  },
  {
    id: "keyword-003",
    text: "obsolete prompt chain",
    active: false,
    hitCount: 0,
    createdAt: "2026-04-10T12:00:00.000Z",
  },
];

export const mockNotificationEvents: NotificationEvent[] = [
  {
    id: "notification-001",
    hotItemId: "hot-001",
    title: "High heat score detected",
    reason: "Matched active keyword: agent benchmark",
    read: false,
    createdAt: "2026-04-21T05:35:00.000Z",
  },
  {
    id: "notification-002",
    hotItemId: "hot-002",
    title: "Keyword match",
    reason: "Matched active keyword: developer tools",
    read: true,
    createdAt: "2026-04-21T01:20:00.000Z",
  },
  {
    id: "notification-003",
    hotItemId: "hot-003",
    title: "Low heat boundary item retained",
    reason: "Kept for filter and empty-state validation",
    read: false,
    createdAt: "2026-04-20T03:05:00.000Z",
  },
];

export const mockScanSummaries: ScanSummary[] = [
  {
    id: "scan-001",
    status: "succeeded",
    startedAt: "2026-04-21T05:30:00.000Z",
    completedAt: "2026-04-21T05:34:30.000Z",
    discoveredCount: 12,
    matchedCount: 4,
  },
  {
    id: "scan-002",
    status: "running",
    startedAt: "2026-04-21T06:00:00.000Z",
    discoveredCount: 3,
    matchedCount: 1,
  },
  {
    id: "scan-003",
    status: "failed",
    startedAt: "2026-04-20T23:00:00.000Z",
    completedAt: "2026-04-20T23:01:08.000Z",
    discoveredCount: 0,
    matchedCount: 0,
    errorMessage: "RSS source returned an invalid feed response.",
  },
];

export const defaultHotItemFilters: HotItemFilters = {
  searchText: "",
  sources: [],
  tags: [],
  minHeatScore: undefined,
};
