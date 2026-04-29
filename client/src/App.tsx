import { useEffect, useState } from 'react';
import type {
  HotItem,
  MonitorKeyword,
  NotificationEvent,
  ScanSummary,
} from './types/domain';
import { HotRadarControls, type HotRadarSort } from './components/HotRadarControls';
import { Layout } from './components/Layout';
import { ListContainer } from './components/ListContainer';
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

  if (sortBy === 'heat-asc') {
    sortedItems.sort((leftItem, rightItem) => leftItem.heatScore - rightItem.heatScore);
    return sortedItems;
  }

  if (sortBy === 'relevance-desc') {
    sortedItems.sort(
      (leftItem, rightItem) => rightItem.relevanceScore - leftItem.relevanceScore
    );
    return sortedItems;
  }

  if (sortBy === 'latest') {
    sortedItems.sort(
      (leftItem, rightItem) =>
        new Date(rightItem.publishedAt).getTime() -
        new Date(leftItem.publishedAt).getTime()
    );
    return sortedItems;
  }

  sortedItems.sort((leftItem, rightItem) => rightItem.heatScore - leftItem.heatScore);
  return sortedItems;
}

export function App() {
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
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minimumHeatScore, setMinimumHeatScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<HotRadarSort>('heat-desc');
  const isAnyNotificationPending = pendingNotificationIds.length > 0;

  useEffect(() => {
    Promise.allSettled([
      fetchHotItems(),
      fetchKeywords(),
      fetchScans(),
      fetchNotifications(),
    ])
      .then(([hotItemsResult, keywordsResult, scansResult, notificationsResult]) => {
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
          setError('数据加载失败，请检查服务是否可用');
        }
      })
      .finally(() => setIsInitialLoading(false));
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
    { id: 'hot', label: '热点', count: hotItems.length },
    { id: 'search', label: '搜索' },
    { id: 'keywords', label: '监控词', count: activeKeywordCount },
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

  async function handleAddKeyword(keywordText: string) {
    const normalizedKeyword = keywordText.trim().toLowerCase();

    if (
      monitorKeywords.some(
        (monitorKeyword) => monitorKeyword.text.trim().toLowerCase() === normalizedKeyword
      )
    ) {
      return false;
    }

    try {
      const newKeyword = await addKeyword(keywordText);
      setMonitorKeywords((currentKeywords) => [newKeyword, ...currentKeywords]);
      return true;
    } catch (addError) {
      console.error('添加监控词失败', addError);
      setError('添加监控词失败，请稍后重试');
      return false;
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
    return <p style={{ padding: '2rem', textAlign: 'center' }}>加载中…</p>;
  }

  return (
    <Layout
      topbar={
        <Topbar
          utilitySlot={
            <button
              aria-controls="notification-panel"
              aria-expanded={isNotificationPanelOpen}
              aria-label={`通知中心，当前 ${unreadNotificationCount} 条未读`}
              className="topbar__button"
              onClick={handleToggleNotificationPanel}
              type="button"
            >
              通知
              <span className="topbar__button-count">{unreadNotificationCount}</span>
            </button>
          }
          actionSlot={
            <button
              aria-label="立即扫描"
              className="topbar__button"
              disabled={isScanning}
              onClick={handleStartScan}
              type="button"
            >
              {isScanning ? '扫描中…' : '立即扫描'}
            </button>
          }
          brand="AI Hot Radar"
          statusLabel={`${hotItems.length} 条热点`}
        />
      }
      tabs={<Tabs activeId={activeTabId} items={tabItems} onChange={setActiveTabId} />}
    >
      {error ? (
        <p style={{ color: 'red', padding: '0.5rem 1rem', margin: 0 }}>{error}</p>
      ) : null}
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
        <div aria-labelledby="tab-hot" id="panel-hot" role="tabpanel" tabIndex={0}>
          <ListContainer
            description="支持关键词搜索、来源与标签筛选、热度门槛和排序，用于快速聚焦当前最值得跟进的热点。"
            meta={`${filteredHotItems.length} / ${hotItems.length} 条 · ${activeFilterCount} 个筛选条件`}
            title="热点雷达"
          >
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
              <ul className="hot-list" aria-label="热点结果列表">
                {filteredHotItems.map((hotItem) => (
                  <li className="hot-list__item" key={hotItem.id}>
                    <span className="hot-list__score">{hotItem.heatScore}</span>
                    <div className="hot-list__content">
                      <div className="hot-list__meta">
                        <p className="hot-list__source">{hotItem.source}</p>
                        <span className="hot-list__relevance">
                          相关度 {hotItem.relevanceScore}
                        </span>
                      </div>
                      <h3 className="hot-list__title">{hotItem.title}</h3>
                      <p className="hot-list__summary">{hotItem.summary}</p>
                      <div className="hot-list__footer">
                        <div className="hot-list__tags" aria-label="热点标签">
                          {hotItem.tags.map((tag) => (
                            <span className="hot-list__tag" key={tag}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="hot-list__published">
                          发布时间 {new Date(hotItem.publishedAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">
                未找到符合当前搜索与筛选条件的热点，请调整关键词、标签、来源或热度门槛。
              </p>
            )}
          </ListContainer>
        </div>
      ) : null}

      {activeTabId === 'search' ? (
        <ListContainer
          description="输入关键词搜索所有热点数据，快速定位感兴趣的内容。"
          meta={`${hotItems.length} 条可搜索`}
          title="搜索"
        >
          <SearchPage
            hotItems={hotItems}
            panelId="panel-search"
            tabId="tab-search"
          />
        </ListContainer>
      ) : null}

      {activeTabId === 'keywords' ? (
        <ListContainer
          description="新增、启停和核对当前监控词，确保后续扫描任务围绕同一组主题持续运行。"
          meta={`${monitorKeywords.length} 个监控词 · ${activeKeywordCount} 个启用`}
          title="监控词"
        >
          <MonitorKeywordsPanel
            keywords={monitorKeywords}
            onAddKeyword={handleAddKeyword}
            onToggleKeyword={handleToggleKeyword}
            panelId="panel-keywords"
            tabId="tab-keywords"
          />
        </ListContainer>
      ) : null}

      <ListContainer meta="只读摘要" title="最近扫描">
        {scanSummary ? (
          <p className="scan-summary">
            状态：{scanSummary.status} · 发现：
            {scanSummary.discoveredCount} · 命中：
            {scanSummary.matchedCount}
          </p>
        ) : (
          <p className="scan-summary">暂无扫描记录</p>
        )}
      </ListContainer>
    </Layout>
  );
}
