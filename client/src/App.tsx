import { useEffect, useState } from 'react';
import type {
  HotItem,
  MonitorKeyword,
  NotificationEvent,
  ScanSummary,
} from './types/domain';
import { HotRadarControls, type HotRadarSort } from './components/HotRadarControls';
import { Layout } from './components/Layout';
import { MonitorKeywordsPanel } from './components/MonitorKeywordsPanel';
import { NotificationPanel } from './components/NotificationPanel';
import { SearchPage } from './components/SearchPage';
import { Tabs } from './components/Tabs';
import { Topbar } from './components/Topbar';
import {
  addKeyword,
  fetchHotItems,
  fetchKeywords,
  fetchNotifications,
  fetchScans,
  markAllNotificationsRead,
  markNotificationRead,
  runScan,
  updateKeyword,
} from './api/client';
import './components/components.css';

const minimumHeatOptions = [0, 20, 40, 60, 80];

function isToday(dateText: string) {
  const currentDate = new Date();
  const targetDate = new Date(dateText);

  return (
    currentDate.getFullYear() === targetDate.getFullYear() &&
    currentDate.getMonth() === targetDate.getMonth() &&
    currentDate.getDate() === targetDate.getDate()
  );
}

function formatDate(dateText: string) {
  return new Date(dateText).toLocaleDateString('zh-CN');
}

function renderHotCard(hotItem: HotItem) {
  return (
    <article className={`hot-card${hotItem.heatScore >= 90 ? ' featured' : ''}`} key={hotItem.id}>
      <div>
        <div className="card-meta">
          <span>{formatDate(hotItem.discoveredAt)} 发现</span>
          <span className="source">{hotItem.source}</span>
          <span>热度 {hotItem.heatScore}</span>
          <span>相关度 {hotItem.relevanceScore}</span>
        </div>
        <h3>{hotItem.title}</h3>
        <p className="summary">{hotItem.summary}</p>
        <div aria-label="热点标签" className="badges">
          {hotItem.tags.map((tag) => (
            <span className="badge" key={tag}>
              #{tag}
            </span>
          ))}
          <span className="badge purple">发布时间 {formatDate(hotItem.publishedAt)}</span>
        </div>
      </div>
      <a
        className="view-button"
        href={hotItem.url}
        rel="noreferrer noopener"
        target="_blank"
      >
        查看
      </a>
    </article>
  );
}

function matchesSearchText(hotItem: HotItem, normalizedSearchText: string) {
  if (!normalizedSearchText) return true;

  const searchableText = [
    hotItem.title,
    hotItem.summary,
    hotItem.source,
    hotItem.tags.join(' '),
  ]
    .join(' ')
    .toLowerCase();

  return searchableText.includes(normalizedSearchText);
}

function sortHotItems(hotItems: HotItem[], sortBy: HotRadarSort) {
  const sortedItems = [...hotItems];

  if (sortBy === 'relevance-desc') {
    sortedItems.sort(
      (leftItem, rightItem) => rightItem.relevanceScore - leftItem.relevanceScore
    );
    return sortedItems;
  }

  if (sortBy === 'published-desc') {
    sortedItems.sort(
      (leftItem, rightItem) =>
        new Date(rightItem.publishedAt).getTime() -
        new Date(leftItem.publishedAt).getTime()
    );
    return sortedItems;
  }

  if (sortBy === 'discovered-desc') {
    sortedItems.sort(
      (leftItem, rightItem) =>
        new Date(rightItem.discoveredAt).getTime() -
        new Date(leftItem.discoveredAt).getTime()
    );
    return sortedItems;
  }

  if (sortBy === 'priority-desc') {
    sortedItems.sort((leftItem, rightItem) => {
      if (rightItem.heatScore !== leftItem.heatScore) {
        return rightItem.heatScore - leftItem.heatScore;
      }

      return rightItem.relevanceScore - leftItem.relevanceScore;
    });
    return sortedItems;
  }

  sortedItems.sort((leftItem, rightItem) => {
    const rightScore = rightItem.heatScore * 0.7 + rightItem.relevanceScore * 0.3;
    const leftScore = leftItem.heatScore * 0.7 + leftItem.relevanceScore * 0.3;

    return rightScore - leftScore;
  });
  return sortedItems;
}

export function App() {
  type AddKeywordResult = 'added' | 'duplicate' | 'failed';

  const [activeTabId, setActiveTabId] = useState('hot');
  const [hotItems, setHotItems] = useState<HotItem[]>([]);
  const [monitorKeywords, setMonitorKeywords] = useState<MonitorKeyword[]>([]);
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [scanSummary, setScanSummary] = useState<ScanSummary | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [pendingNotificationIds, setPendingNotificationIds] = useState<string[]>([]);
  const [isMarkingAllNotifications, setIsMarkingAllNotifications] = useState(false);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minimumHeatScore, setMinimumHeatScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<HotRadarSort>('heat-desc');
  const isAnyNotificationPending = pendingNotificationIds.length > 0;

  async function loadInitialData() {
    setIsInitialLoading(true);
    setInitialLoadError(null);

    const [hotItemsResult, keywordsResult, scansResult, notificationsResult] =
      await Promise.allSettled([
      fetchHotItems(),
      fetchKeywords(),
      fetchScans(),
      fetchNotifications(),
      ]);

    if (hotItemsResult.status === 'fulfilled') {
      setHotItems(hotItemsResult.value);
    }

    if (keywordsResult.status === 'fulfilled') {
      setMonitorKeywords(keywordsResult.value);
    }

    if (scansResult.status === 'fulfilled') {
      setScanSummary(scansResult.value[0] ?? null);
    }

    if (notificationsResult.status === 'fulfilled') {
      setNotifications(notificationsResult.value);
    }

    if (
      hotItemsResult.status === 'rejected' ||
      keywordsResult.status === 'rejected' ||
      scansResult.status === 'rejected' ||
      notificationsResult.status === 'rejected'
    ) {
      setInitialLoadError('数据加载失败，请检查服务是否可用');
    }

    setIsInitialLoading(false);
  }

  useEffect(() => {
    void loadInitialData();
  }, []);

  const activeKeywordCount = monitorKeywords.filter((keyword) => keyword.active).length;
  const unreadNotificationCount = notifications.filter((notification) => !notification.read).length;

  const sourceOptions = Array.from(
    new Set(hotItems.map((hotItem) => hotItem.source))
  ).sort((leftSource, rightSource) => leftSource.localeCompare(rightSource));

  const tagOptions = Array.from(
    new Set(hotItems.flatMap((hotItem) => hotItem.tags))
  ).sort((leftTag, rightTag) => leftTag.localeCompare(rightTag));

  const tabItems = [
    { id: 'hot', label: '热点雷达' },
    { id: 'keywords', label: '监控词' },
    { id: 'search', label: '搜索' },
  ];

  const normalizedSearchText = searchText.trim().toLowerCase();
  const filteredHotItems = sortHotItems(
    hotItems.filter((hotItem) => {
      if (!matchesSearchText(hotItem, normalizedSearchText)) return false;

      if (selectedSources.length > 0 && !selectedSources.includes(hotItem.source)) {
        return false;
      }

      if (
        selectedTags.length > 0 &&
        !selectedTags.every((selectedTag) => hotItem.tags.includes(selectedTag))
      ) {
        return false;
      }

      return hotItem.heatScore >= minimumHeatScore;
    }),
    sortBy
  );

  const activeFilterCount =
    selectedSources.length +
    selectedTags.length +
    (minimumHeatScore > 0 ? 1 : 0) +
    (normalizedSearchText ? 1 : 0);
  const totalHotCount = hotItems.length;
  const todayHotCount = hotItems.filter((hotItem) => isToday(hotItem.discoveredAt)).length;
  const urgentHotCount = hotItems.filter((hotItem) => hotItem.heatScore >= 90).length;
  const layoutStats = [
    { id: 'total', icon: '⌁', label: '总热点', value: totalHotCount },
    { id: 'today', icon: '◷', label: '今日新增', value: todayHotCount, tone: 'cyan' as const },
    { id: 'urgent', icon: '⚠', label: '紧急热点', value: urgentHotCount, tone: 'danger' as const },
    { id: 'keywords', icon: '◎', label: '启用监控词', value: activeKeywordCount, tone: 'green' as const },
  ];

  async function handleAddKeyword(keywordText: string): Promise<AddKeywordResult> {
    const normalizedKeyword = keywordText.trim().toLowerCase();

    if (
      monitorKeywords.some(
        (monitorKeyword) => monitorKeyword.text.trim().toLowerCase() === normalizedKeyword
      )
    ) {
      return 'duplicate';
    }

    try {
      const newKeyword = await addKeyword(keywordText);
      setMonitorKeywords((currentKeywords) => [newKeyword, ...currentKeywords]);
      return 'added';
    } catch (addError) {
      console.error('添加监控词失败', addError);
      setError('添加监控词失败，请稍后重试');
      return 'failed';
    }
  }

  async function handleToggleKeyword(keywordId: string) {
    const target = monitorKeywords.find((k) => k.id === keywordId);
    if (!target) return;

    try {
      const updated = await updateKeyword(keywordId, { active: !target.active });
      setMonitorKeywords((currentKeywords) =>
        currentKeywords.map((k) => (k.id === keywordId ? updated : k))
      );
    } catch (toggleError) {
      console.error('切换监控词状态失败', toggleError);
      setError('切换监控词状态失败，请稍后重试');
    }
  }

  async function handleStartScan() {
    if (isScanning) return;

    setIsScanning(true);
    try {
      const result = await runScan();
      setScanSummary(result);
      const [refreshedHotItemsResult, refreshedNotificationsResult] = await Promise.allSettled([
        fetchHotItems(),
        fetchNotifications(),
      ]);

      if (refreshedHotItemsResult.status === 'fulfilled') {
        setHotItems(refreshedHotItemsResult.value);
      }

      if (refreshedNotificationsResult.status === 'fulfilled') {
        setNotifications(refreshedNotificationsResult.value);
      }

      if (
        refreshedHotItemsResult.status === 'rejected' ||
        refreshedNotificationsResult.status === 'rejected'
      ) {
        setError('数据加载失败，请检查服务是否可用');
      }
    } catch (scanError) {
      console.error('扫描失败', scanError);
      setError('扫描失败，请稍后重试');
    } finally {
      setIsScanning(false);
    }
  }

  function handleToggleNotificationPanel() {
    setIsNotificationPanelOpen((currentOpen) => !currentOpen);
  }

  async function handleMarkNotificationRead(notificationId: string) {
    const targetNotification = notifications.find(
      (notification) => notification.id === notificationId
    );
    if (
      !targetNotification ||
      targetNotification.read ||
      pendingNotificationIds.includes(notificationId) ||
      isMarkingAllNotifications
    ) {
      return;
    }

    setPendingNotificationIds((currentPendingIds) => [...currentPendingIds, notificationId]);
    try {
      await markNotificationRead(notificationId);
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (notificationError) {
      console.error('通知标记已读失败', notificationError);
      setError('通知更新失败，请稍后重试');
    } finally {
      setPendingNotificationIds((currentPendingIds) =>
        currentPendingIds.filter((pendingId) => pendingId !== notificationId)
      );
    }
  }

  async function handleMarkAllNotificationsRead() {
    if (unreadNotificationCount === 0 || isMarkingAllNotifications || isAnyNotificationPending) {
      return;
    }

    setIsMarkingAllNotifications(true);
    try {
      await markAllNotificationsRead();
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.read ? notification : { ...notification, read: true }
        )
      );
    } catch (notificationError) {
      console.error('全部通知标记已读失败', notificationError);
      setError('通知更新失败，请稍后重试');
    } finally {
      setIsMarkingAllNotifications(false);
    }
  }

  if (isInitialLoading) {
    return <div className="loading-state">加载中…</div>;
  }

  return (
    <Layout
      stats={layoutStats}
      topbar={
        <Topbar
          brand="AI Hot Radar"
          isNotificationPanelOpen={isNotificationPanelOpen}
          isScanning={isScanning}
          subtitle="AI 热点雷达"
          unreadCount={unreadNotificationCount}
          onStartScan={handleStartScan}
          onToggleNotifications={handleToggleNotificationPanel}
        />
      }
      tabs={<Tabs activeId={activeTabId} items={tabItems} onChange={setActiveTabId} />}
    >
      {initialLoadError ? (
        <div className="error-banner" role="alert">
          <span>{initialLoadError}</span>
          <button
            className="notification-panel__action"
            type="button"
            onClick={() => void loadInitialData()}
          >
            重试
          </button>
        </div>
      ) : null}
      {error ? <p className="error-banner">{error}</p> : null}
      {isNotificationPanelOpen ? (
        <NotificationPanel
          isMarkAllPending={isMarkingAllNotifications}
          pendingNotificationIds={pendingNotificationIds}
          notifications={notifications}
          unreadCount={unreadNotificationCount}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onMarkRead={handleMarkNotificationRead}
        />
      ) : null}
      {activeTabId === 'hot' ? (
        <section
          aria-labelledby="tab-hot"
          className="view-section active"
          id="panel-hot"
          role="tabpanel"
          tabIndex={0}
        >
          <div className="section-title-row">
            <h2 className="section-title">🔥 实时热点流</h2>
            <div className="refresh-note">
              {filteredHotItems.length} / {hotItems.length} 条 · {activeFilterCount} 个筛选条件
            </div>
          </div>

          <div className="scan-summary">
            {scanSummary ? (
              <>
                <span>状态：{scanSummary.status}</span>
                <span>发现：{scanSummary.discoveredCount}</span>
                <span>命中：{scanSummary.matchedCount}</span>
              </>
            ) : (
              <span>暂无扫描记录</span>
            )}
          </div>

          <div className="panel-block">
            <HotRadarControls
              minimumHeatOptions={minimumHeatOptions}
              minimumHeatScore={minimumHeatScore}
              searchText={searchText}
              selectedSources={selectedSources}
              selectedTags={selectedTags}
              sortBy={sortBy}
              sourceOptions={sourceOptions}
              tagOptions={tagOptions}
              onMinimumHeatScoreChange={setMinimumHeatScore}
              onSearchTextChange={setSearchText}
              onSelectedSourcesChange={setSelectedSources}
              onSelectedTagsChange={setSelectedTags}
              onSortByChange={setSortBy}
            />

            {filteredHotItems.length > 0 ? (
              <div className="hot-list" aria-label="热点结果列表">
                {filteredHotItems.map(renderHotCard)}
              </div>
            ) : (
              <p className="empty-state visible">
                未找到符合当前搜索与筛选条件的热点，请调整关键词、标签、来源或热度门槛。
              </p>
            )}
          </div>
        </section>
      ) : null}

      {activeTabId === 'search' ? (
        <SearchPage hotItems={hotItems} panelId="panel-search" tabId="tab-search" />
      ) : null}

      {activeTabId === 'keywords' ? (
        <MonitorKeywordsPanel
          keywords={monitorKeywords}
          onAddKeyword={handleAddKeyword}
          onToggleKeyword={handleToggleKeyword}
          panelId="panel-keywords"
          tabId="tab-keywords"
        />
      ) : null}
    </Layout>
  );
}
