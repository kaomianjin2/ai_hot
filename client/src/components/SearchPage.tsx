import { useState } from 'react';
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

export function SearchPage({ hotItems, panelId, tabId }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? hotItems.filter((hotItem) => matchesQuery(hotItem, normalizedQuery))
    : [];
  const hasQuery = normalizedQuery.length > 0;

  return (
    <div
      aria-labelledby={tabId}
      className="search-page"
      id={panelId}
      role="tabpanel"
      tabIndex={0}
    >
      <div className="search-page__input-row">
        <label className="search-page__label" htmlFor="search-page-input">
          搜索关键词
        </label>
        <input
          autoComplete="off"
          className="search-page__input"
          id="search-page-input"
          placeholder="输入关键词搜索热点..."
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {hasQuery ? (
        <p className="search-page__status">
          找到 {results.length} 条结果
        </p>
      ) : (
        <p className="search-page__status">
          输入关键词开始搜索
        </p>
      )}

      {hasQuery && results.length > 0 ? (
        <ul className="hot-list" aria-label="搜索结果列表">
          {results.map((hotItem) => (
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
      ) : null}

      {hasQuery && results.length === 0 ? (
        <p className="empty-state">
          未找到包含"{query.trim()}"的热点，请尝试其他关键词。
        </p>
      ) : null}
    </div>
  );
}
