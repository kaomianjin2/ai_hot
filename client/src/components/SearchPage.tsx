import { useState, type FormEvent } from 'react';
import type { HotItem } from '../types/domain';

type SearchPageProps = {
  hotItems: HotItem[];
  panelId: string;
  tabId: string;
};

function matchesQuery(hotItem: HotItem, normalizedQuery: string) {
  if (!normalizedQuery) {
    return false;
  }

  const searchableText = [
    hotItem.title,
    hotItem.summary,
    hotItem.source,
    hotItem.tags.join(' '),
  ]
    .join(' ')
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

function renderHotCard(hotItem: HotItem) {
  return (
    <article className={`hot-card${hotItem.heatScore >= 90 ? ' featured' : ''}`} key={hotItem.id}>
      <div>
        <div className="card-meta">
          <span>{new Date(hotItem.discoveredAt).toLocaleDateString('zh-CN')} 发现</span>
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
          <span className="badge purple">
            发布时间 {new Date(hotItem.publishedAt).toLocaleDateString('zh-CN')}
          </span>
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

export function SearchPage({ hotItems, panelId, tabId }: SearchPageProps) {
  const [draftQuery, setDraftQuery] = useState('');
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? hotItems.filter((hotItem) => matchesQuery(hotItem, normalizedQuery))
    : [];
  const hasQuery = normalizedQuery.length > 0;
  const activeFilterCount = hasQuery ? 1 : 0;

  function handleSubmitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(draftQuery);
  }

  function handleResetSearch() {
    setDraftQuery('');
    setQuery('');
  }

  return (
    <div
      aria-labelledby={tabId}
      className="view-section active"
      id={panelId}
      role="tabpanel"
      tabIndex={0}
      >
      <div className="section-title-row">
        <h2 className="section-title">⌕ 搜索热点</h2>
        <div className="refresh-note">{hotItems.length} 条可搜索热点</div>
      </div>

      <section aria-label="搜索排序与筛选" className="toolbar">
        <div className="sort-group" aria-label="搜索维度">
          <span className="chip">最新发现</span>
          <span className="chip">最新发布</span>
          <span className="chip">重要程度</span>
          <span className="chip">相关性</span>
          <span className="chip active">搜索综合</span>
        </div>
        <div className="filter-group">
          <div className="filter-button active" aria-label="搜索筛选状态">
            <span>▽ 筛选</span>
            <span className="filter-dot">{activeFilterCount}</span>
          </div>
          <button className="filter-button" type="button" onClick={handleResetSearch}>
            ↻ 重置
          </button>
        </div>
      </section>

      <section aria-label="搜索筛选面板" className="filter-panel search-filter-panel">
        <div className="filter-row">
          <div className="select-shell" aria-label="来源维度">
            <span className="filter-summary">全部来源</span>
          </div>
          <div className="select-shell" aria-label="时间维度">
            <span className="filter-summary">全部时间</span>
          </div>
          <div className="select-shell" aria-label="真实性维度">
            <span className="filter-summary">全部状态</span>
          </div>
        </div>
      </section>

      <div className="search-panel">
        <form className="search-row" onSubmit={handleSubmitSearch}>
          <input
            autoComplete="off"
            aria-label="搜索页搜索输入"
            className="search-input"
            id="search-page-input"
            placeholder="输入关键词搜索热点..."
            type="search"
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
          />
          <button className="search-button" type="submit">
            搜索
          </button>
        </form>
      </div>

      <p className="search-status">
        {hasQuery ? `找到 ${results.length} 条结果` : '输入关键词后展示搜索结果。'}
      </p>

      {hasQuery && results.length > 0 ? <div className="hot-list">{results.map(renderHotCard)}</div> : null}

      {hasQuery && results.length === 0 ? <p className="empty-state visible">没有匹配的热点。</p> : null}
    </div>
  );
}
