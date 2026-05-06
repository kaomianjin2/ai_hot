import { useEffect, useState, type FormEvent } from 'react';

type HotRadarControlsProps = {
  searchText: string;
  selectedSources: string[];
  selectedTags: string[];
  minimumHeatScore: number;
  minimumHeatOptions: number[];
  sortBy: HotRadarSort;
  sourceOptions: string[];
  tagOptions: string[];
  onSearchTextChange: (value: string) => void;
  onSelectedSourcesChange: (value: string[]) => void;
  onSelectedTagsChange: (value: string[]) => void;
  onMinimumHeatScoreChange: (value: number) => void;
  onSortByChange: (value: HotRadarSort) => void;
  onReset: () => void;
};

export type HotRadarSort =
  | 'discovered-desc'
  | 'published-desc'
  | 'priority-desc'
  | 'relevance-desc'
  | 'heat-desc';

const sortOptions: Array<{ label: string; value: HotRadarSort }> = [
  { label: '最新发现', value: 'discovered-desc' },
  { label: '最新发布', value: 'published-desc' },
  { label: '重要程度', value: 'priority-desc' },
  { label: '相关性', value: 'relevance-desc' },
  { label: '热度综合', value: 'heat-desc' },
];

function toggleOption(currentValues: string[], nextValue: string) {
  if (currentValues.includes(nextValue)) {
    return currentValues.filter((currentValue) => currentValue !== nextValue);
  }

  return [...currentValues, nextValue];
}

export function HotRadarControls({
  searchText,
  selectedSources,
  selectedTags,
  minimumHeatScore,
  minimumHeatOptions,
  sortBy,
  sourceOptions,
  tagOptions,
  onSearchTextChange,
  onSelectedSourcesChange,
  onSelectedTagsChange,
  onMinimumHeatScoreChange,
  onSortByChange,
  onReset,
}: HotRadarControlsProps) {
  const [draftSearchText, setDraftSearchText] = useState(searchText);

  useEffect(() => {
    setDraftSearchText(searchText);
  }, [searchText]);

  const activeFilterCount =
    selectedSources.length +
    selectedTags.length +
    (minimumHeatScore > 0 ? 1 : 0) +
    (searchText.trim() ? 1 : 0);

  function handleSubmitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearchTextChange(draftSearchText);
  }

  return (
    <>
      <section aria-label="排序与筛选" className="toolbar">
        <div className="sort-group">
          {sortOptions.map((sortOption) => (
            <button
              className={`chip${sortBy === sortOption.value ? ' active' : ''}`}
              key={sortOption.value}
              type="button"
              onClick={() => onSortByChange(sortOption.value)}
            >
              {sortOption.label}
            </button>
          ))}
        </div>
        <div className="filter-group">
          <div className="filter-button active">
            <span>▽ 筛选</span>
            <span className="filter-dot">{activeFilterCount}</span>
          </div>
          <button className="filter-button" type="button" onClick={onReset}>
            ↻ 重置
          </button>
        </div>
      </section>

      <section aria-label="热点筛选条件" className="filter-panel">
        <div className="filter-field">
          <span className="field-label">最低热度</span>
          <label className="select-shell" htmlFor="hot-heat">
            <select
              className="control-select"
              id="hot-heat"
              name="hot-heat"
              value={minimumHeatScore}
              onChange={(event) => onMinimumHeatScoreChange(Number(event.target.value))}
            >
              {minimumHeatOptions.map((heatOption) => (
                <option key={heatOption} value={heatOption}>
                  {heatOption === 0 ? '全部热度' : `${heatOption} 分以上`}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="filter-field" aria-label="来源筛选">
          <span className="field-label">来源</span>
          <div className="filter-row">
            {sourceOptions.map((sourceOption) => {
              const isSelected = selectedSources.includes(sourceOption);

              return (
                <button
                  className={`filter-chip${isSelected ? ' active' : ''}`}
                  data-active={isSelected}
                  key={sourceOption}
                  type="button"
                  onClick={() =>
                    onSelectedSourcesChange(toggleOption(selectedSources, sourceOption))
                  }
                >
                  {sourceOption}
                </button>
              );
            })}
          </div>
        </div>

        <div className="filter-field" aria-label="标签筛选">
          <span className="field-label">标签</span>
          <div className="filter-row">
            {tagOptions.map((tagOption) => {
              const isSelected = selectedTags.includes(tagOption);

              return (
                <button
                  className={`filter-chip${isSelected ? ' active' : ''}`}
                  data-active={isSelected}
                  key={tagOption}
                  type="button"
                  onClick={() => onSelectedTagsChange(toggleOption(selectedTags, tagOption))}
                >
                  #{tagOption}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="search-panel">
        <form className="search-row" onSubmit={handleSubmitSearch}>
          <input
            aria-label="热点搜索"
            className="search-input"
            id="hot-search"
            name="hot-search"
            placeholder="按标题、摘要、标签、来源搜索"
            type="search"
            value={draftSearchText}
            onChange={(event) => setDraftSearchText(event.target.value)}
          />
          <button className="search-button" type="submit">
            搜索
          </button>
        </form>
      </section>
    </>
  );
}
