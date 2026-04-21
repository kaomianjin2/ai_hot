import {
  mockHotItems,
  mockMonitorKeywords,
  mockNotificationEvents,
  mockScanSummaries,
} from "./data/mockData";
import { Layout } from "./components/Layout";
import { ListContainer } from "./components/ListContainer";
import { Tabs } from "./components/Tabs";
import { Topbar } from "./components/Topbar";
import "./components/components.css";

const activeKeywords = mockMonitorKeywords.filter((keyword) => keyword.active);
const unreadNotificationCount = mockNotificationEvents.filter(
  (notificationEvent) => !notificationEvent.read
).length;
const latestScanSummary = mockScanSummaries[0];

const tabItems = [
  { id: "hot", label: "热点", count: mockHotItems.length },
  { id: "keywords", label: "监控词", count: activeKeywords.length },
  { id: "notifications", label: "通知", count: unreadNotificationCount },
];

export function App() {
  return (
    <Layout
      topbar={
        <Topbar
          actionSlot={<span>操作入口预留</span>}
          brand="AI Hot Radar"
          statusLabel={`${mockHotItems.length} 条热点 · ${unreadNotificationCount} 条未读`}
        />
      }
      tabs={<Tabs activeId="hot" items={tabItems} />}
    >
      <ListContainer
        description="按热度展示当前可验证的热点摘要，后续搜索、筛选和扫描动作将在独立任务接入。"
        meta="基础列表容器"
        title="热点雷达"
      >
        {mockHotItems.length > 0 ? (
          <ul className="hot-list">
            {mockHotItems.map((hotItem) => (
              <li className="hot-list__item" key={hotItem.id}>
                <span className="hot-list__score">{hotItem.heatScore}</span>
                <div>
                  <p className="hot-list__source">{hotItem.source}</p>
                  <h3 className="hot-list__title">{hotItem.title}</h3>
                  <p className="hot-list__summary">{hotItem.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">暂无热点数据</p>
        )}
      </ListContainer>

      <ListContainer
        description="展示已启用监控词，便于后续任务复用布局壳接入管理能力。"
        meta={`${activeKeywords.length} 个启用`}
        title="监控词概览"
      >
        {activeKeywords.length > 0 ? (
          <div className="keyword-strip">
            {activeKeywords.map((keyword) => (
              <span className="keyword-strip__item" key={keyword.id}>
                {keyword.text} · {keyword.hitCount}
              </span>
            ))}
          </div>
        ) : (
          <p className="empty-state">暂无启用监控词</p>
        )}
      </ListContainer>

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
