import { useState } from "react";
import {
  mockHotItems,
  mockMonitorKeywords,
  mockNotificationEvents,
  mockScanSummaries,
} from "./data/mockData";
import type { HotItem, MonitorKeyword } from "./types/domain";
import { HotRadarControls, type HotRadarSort } from "./components/HotRadarControls";
import { Layout } from "./components/Layout";
import { ListContainer } from "./components/ListContainer";
import { MonitorKeywordsPanel } from "./components/MonitorKeywordsPanel";
import { SearchPage } from "./components/SearchPage";
import { Tabs } from "./components/Tabs";
import { Topbar } from "./components/Topbar";
import "./components/components.css";

const unreadNotificationCount = mockNotificationEvents.filter(
  (notificationEvent) => !notificationEvent.read
).length;
const latestScanSummary = mockScanSummaries[0];

const sourceOptions = Array.from(
  new Set(mockHotItems.map((hotItem) => hotItem.source))
).sort((leftSource, rightSource) => leftSource.localeCompare(rightSource));

const tagOptions = Array.from(
  new Set(mockHotItems.flatMap((hotItem) => hotItem.tags))
).sort((leftTag, rightTag) => leftTag.localeCompare(rightTag));

const minimumHeatOptions = [0, 20, 40, 60, 80];

function matchesSearchText(hotItem: HotItem, normalizedSearchText: string) {
  if (!normalizedSearchText) {
    return true;
  }

  const searchableText = [
    hotItem.title,
    hotItem.summary,
    hotItem.source,
    hotItem.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedSearchText);
}

function sortHotItems(hotItems: HotItem[], sortBy: HotRadarSort) {
  const sortedItems = [...hotItems];

  if (sortBy === "heat-asc") {
    sortedItems.sort((leftItem, rightItem) => leftItem.heatScore - rightItem.heatScore);
    return sortedItems;
  }

  if (sortBy === "relevance-desc") {
    sortedItems.sort(
      (leftItem, rightItem) => rightItem.relevanceScore - leftItem.relevanceScore
    );
    return sortedItems;
  }

  if (sortBy === "latest") {
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

function createMonitorKeywordId(keywordText: string, keywordCount: number) {
  const normalizedKeyword = keywordText.trim().toLowerCase().replace(/\s+/g, "-");
  const timestamp = Date.now().toString(36);

  return `keyword-${normalizedKeyword}-${keywordCount + 1}-${timestamp}`;
}

function createMonitorKeyword(keywordText: string, keywordCount: number): MonitorKeyword {
  return {
    id: createMonitorKeywordId(keywordText, keywordCount),
    text: keywordText,
    active: true,
    hitCount: 0,
    createdAt: new Date().toISOString(),
  };
}

export function App() {
  const [activeTabId, setActiveTabId] = useState("hot");
  const [monitorKeywords, setMonitorKeywords] = useState(mockMonitorKeywords);
  const [searchText, setSearchText] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minimumHeatScore, setMinimumHeatScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<HotRadarSort>("heat-desc");
  const activeKeywordCount = monitorKeywords.filter((keyword) => keyword.active).length;
  const tabItems = [
    { id: "hot", label: "热点", count: mockHotItems.length },
    { id: "search", label: "搜索" },
    { id: "keywords", label: "监控词", count: activeKeywordCount },
    { id: "notifications", label: "通知", count: unreadNotificationCount },
  ];

  const normalizedSearchText = searchText.trim().toLowerCase();
  const filteredHotItems = sortHotItems(
    mockHotItems.filter((hotItem) => {
      if (!matchesSearchText(hotItem, normalizedSearchText)) {
        return false;
      }

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

  function handleAddKeyword(keywordText: string) {
    const normalizedKeyword = keywordText.trim().toLowerCase();

    if (
      monitorKeywords.some(
        (monitorKeyword) => monitorKeyword.text.trim().toLowerCase() === normalizedKeyword
      )
    ) {
      return false;
    }

    setMonitorKeywords((currentKeywords) => {
      const nextKeyword = createMonitorKeyword(keywordText, currentKeywords.length);
      return [nextKeyword, ...currentKeywords];
    });
    return true;
  }

  function handleToggleKeyword(keywordId: string) {
    setMonitorKeywords((currentKeywords) =>
      currentKeywords.map((monitorKeyword) =>
        monitorKeyword.id === keywordId
          ? { ...monitorKeyword, active: !monitorKeyword.active }
          : monitorKeyword
      )
    );
  }

  return (
    <Layout
      topbar={
        <Topbar
          actionSlot={<span>操作入口预留</span>}
          brand="AI Hot Radar"
          statusLabel={`${mockHotItems.length} 条热点 · ${unreadNotificationCount} 条未读`}
        />
      }
      tabs={<Tabs activeId={activeTabId} items={tabItems} onChange={setActiveTabId} />}
    >
      {activeTabId === "hot" ? (
        <div aria-labelledby="tab-hot" id="panel-hot" role="tabpanel" tabIndex={0}>
          <ListContainer
            description="支持关键词搜索、来源与标签筛选、热度门槛和排序，用于快速聚焦当前最值得跟进的热点。"
            meta={`${filteredHotItems.length} / ${mockHotItems.length} 条 · ${activeFilterCount} 个筛选条件`}
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
                          发布时间 {new Date(hotItem.publishedAt).toLocaleDateString("zh-CN")}
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

      {activeTabId === "search" ? (
        <ListContainer
          description="输入关键词搜索所有热点数据，快速定位感兴趣的内容。"
          meta={`${mockHotItems.length} 条可搜索`}
          title="搜索"
        >
          <SearchPage
            hotItems={mockHotItems}
            panelId="panel-search"
            tabId="tab-search"
          />
        </ListContainer>
      ) : null}

      {activeTabId === "keywords" ? (
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

      {activeTabId === "notifications" ? (
        <div
          aria-labelledby="tab-notifications"
          id="panel-notifications"
          role="tabpanel"
          tabIndex={0}
        >
          <ListContainer
            description="通知页面待后续任务接入，这里保留当前未读数量与布局位置。"
            meta={`${unreadNotificationCount} 条未读`}
            title="通知"
          >
            <p className="empty-state">通知能力将在后续任务中接入。</p>
          </ListContainer>
        </div>
      ) : null}

      <ListContainer meta="只读摘要" title="最近扫描">
        {latestScanSummary ? (
          <p className="scan-summary">
            状态：{latestScanSummary.status} · 发现：
            {latestScanSummary.discoveredCount} · 命中：
            {latestScanSummary.matchedCount}
          </p>
        ) : (
          <p className="empty-state">暂无扫描记录</p>
        )}
      </ListContainer>
    </Layout>
  );
}
