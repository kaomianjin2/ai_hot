import { useState, type FormEvent } from "react";
import type { MonitorKeyword } from "../types/domain";

type MonitorKeywordsPanelProps = {
  keywords: MonitorKeyword[];
  onAddKeyword: (keywordText: string) => boolean | Promise<boolean>;
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

    if (!(await onAddKeyword(normalizedKeyword))) {
      setFeedbackMessage("监控词已存在，请勿重复添加。");
      return;
    }

    setDraftKeyword("");
    setFeedbackMessage(`已新增监控词：${normalizedKeyword}`);
  }

  return (
    <div
      aria-labelledby={tabId}
      className="monitor-panel"
      id={panelId}
      role="tabpanel"
      tabIndex={0}
    >
      <form className="monitor-panel__form" onSubmit={handleSubmit}>
        <label className="monitor-panel__field" htmlFor="monitor-keyword-input">
          <span className="hot-controls__label">新增监控词</span>
          <input
            className="hot-controls__input"
            id="monitor-keyword-input"
            name="monitor-keyword-input"
            placeholder="输入需要持续追踪的主题词"
            type="text"
            value={draftKeyword}
            onChange={(event) => setDraftKeyword(event.target.value)}
          />
        </label>
        <button className="monitor-panel__submit" type="submit">
          添加监控词
        </button>
      </form>

      <div className="monitor-panel__summary" aria-live="polite">
        <span>{keywords.length} 个监控词</span>
        <span>{activeKeywordCount} 个启用</span>
        {feedbackMessage ? <span>{feedbackMessage}</span> : null}
      </div>

      {keywords.length > 0 ? (
        <ul className="monitor-list" aria-label="监控词列表">
          {keywords.map((keyword) => (
            <li className="monitor-list__item" key={keyword.id}>
              <div className="monitor-list__content">
                <div className="monitor-list__meta">
                  <p className="monitor-list__label">{keyword.text}</p>
                  <span className="monitor-list__status">
                    {keyword.active ? "已开启" : "已停用"}
                  </span>
                </div>
                <p className="monitor-list__detail">
                  命中 {keyword.hitCount} 次 · 创建于{" "}
                  {new Date(keyword.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </div>
              <button
                aria-label={`${keyword.text}${keyword.active ? "停用" : "启用"}`}
                aria-pressed={keyword.active}
                className="monitor-list__toggle"
                data-active={keyword.active}
                type="button"
                onClick={() => onToggleKeyword(keyword.id)}
              >
                <span className="monitor-list__toggle-track">
                  <span className="monitor-list__toggle-thumb" />
                </span>
                <span>{keyword.active ? "开启" : "停用"}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">暂无监控词，请先新增至少一个关键词。</p>
      )}
    </div>
  );
}
