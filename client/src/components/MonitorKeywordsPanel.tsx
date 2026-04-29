import { useState, type FormEvent } from "react";
import type { MonitorKeyword } from "../types/domain";

type AddKeywordResult = "added" | "duplicate" | "failed";

type MonitorKeywordsPanelProps = {
  keywords: MonitorKeyword[];
  onAddKeyword: (keywordText: string) => AddKeywordResult | Promise<AddKeywordResult>;
  onToggleKeyword: (keywordId: string) => void;
  panelId: string;
  tabId: string;
};

export function MonitorKeywordsPanel({
  keywords,
  onAddKeyword,
  onToggleKeyword,
  panelId,
  tabId,
}: MonitorKeywordsPanelProps) {
  const [draftKeyword, setDraftKeyword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const activeKeywordCount = keywords.filter((keyword) => keyword.active).length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedKeyword = draftKeyword.trim();

    if (!normalizedKeyword) {
      setFeedbackMessage("请输入监控词后再提交。");
      return;
    }

    const addKeywordResult = await onAddKeyword(normalizedKeyword);

    if (addKeywordResult === "duplicate") {
      setFeedbackMessage("监控词已存在，请勿重复添加。");
      return;
    }

    if (addKeywordResult === "failed") {
      setFeedbackMessage("新增监控词失败，请稍后重试。");
      return;
    }

    setDraftKeyword("");
    setFeedbackMessage(`已新增监控词：${normalizedKeyword}`);
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
        <h2 className="section-title">◎ 监控词</h2>
        <div className="refresh-note">
          {keywords.length} 个监控词 · {activeKeywordCount} 个启用
        </div>
      </div>

      <div className="search-panel">
        <form className="search-row monitor-search-row" onSubmit={handleSubmit}>
          <input
            aria-label="监控词输入"
            className="search-input"
            id="monitor-keyword-input"
            name="monitor-keyword-input"
            placeholder="输入需要持续追踪的主题词"
            type="text"
            value={draftKeyword}
            onChange={(event) => setDraftKeyword(event.target.value)}
          />
          <button className="search-button" type="submit">
            添加监控词
          </button>
        </form>
        <div aria-live="polite" className="monitor-feedback">
          {feedbackMessage || '新增监控词后会参与后续扫描命中判断。'}
        </div>
      </div>

      {keywords.length > 0 ? (
        <div className="monitor-grid" aria-label="监控词列表">
          {keywords.map((keyword) => (
            <article
              className={`monitor-card${keyword.active ? '' : ' disabled'}`}
              key={keyword.id}
            >
              <div className="monitor-copy">
                <div className="monitor-card__meta">
                  <p className="monitor-card__label">{keyword.text}</p>
                  <span className="monitor-card__status">
                    {keyword.active ? '已开启' : '已停用'}
                  </span>
                </div>
                <p className="monitor-card__detail">
                  命中 {keyword.hitCount} 次 · 创建于{' '}
                  {new Date(keyword.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <button
                aria-label={`${keyword.text}${keyword.active ? '停用' : '启用'}`}
                aria-pressed={keyword.active}
                className="monitor-toggle"
                type="button"
                onClick={() => onToggleKeyword(keyword.id)}
              >
                <span className="switch" aria-hidden="true" />
                <span>{keyword.active ? '停用' : '启用'}</span>
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state visible">暂无监控词，请先新增至少一个关键词。</p>
      )}
    </div>
  );
}
