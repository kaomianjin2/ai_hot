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
};

export type HotRadarSort =
  | "heat-desc"
  | "heat-asc"
  | "relevance-desc"
  | "latest";

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
}: HotRadarControlsProps) {
  return (
    <section className="hot-controls" aria-label="热点筛选控件">
      <div className="hot-controls__header">
        <label className="hot-controls__search" htmlFor="hot-search">
          <span className="hot-controls__label">热点搜索</span>
          <input
            className="hot-controls__input"
            id="hot-search"
            name="hot-search"
            placeholder="按标题、摘要、标签、来源搜索"
            type="search"
            value={searchText}
            onChange={(event) => onSearchTextChange(event.target.value)}
          />
        </label>

        <label className="hot-controls__select-field" htmlFor="hot-sort">
          <span className="hot-controls__label">排序</span>
          <select
            className="hot-controls__select"
            id="hot-sort"
            name="hot-sort"
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value as HotRadarSort)}
          >
            <option value="heat-desc">热度从高到低</option>
            <option value="heat-asc">热度从低到高</option>
            <option value="relevance-desc">相关度优先</option>
            <option value="latest">最新发布时间</option>
          </select>
        </label>

        <label className="hot-controls__select-field" htmlFor="hot-heat">
          <span className="hot-controls__label">最低热度</span>
          <select
            className="hot-controls__select"
            id="hot-heat"
            name="hot-heat"
            value={minimumHeatScore}
            onChange={(event) => onMinimumHeatScoreChange(Number(event.target.value))}
          >
            {minimumHeatOptions.map((heatOption) => (
              <option key={heatOption} value={heatOption}>
                {heatOption === 0 ? "全部热度" : `${heatOption} 分以上`}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="hot-controls__filters">
        <div className="hot-controls__group" aria-label="来源筛选">
          <span className="hot-controls__label">来源</span>
          <div className="hot-controls__chips">
            {sourceOptions.map((sourceOption) => {
              const isSelected = selectedSources.includes(sourceOption);

              return (
                <button
                  className="hot-controls__chip"
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

        <div className="hot-controls__group" aria-label="标签筛选">
          <span className="hot-controls__label">标签</span>
          <div className="hot-controls__chips">
            {tagOptions.map((tagOption) => {
              const isSelected = selectedTags.includes(tagOption);

              return (
                <button
                  className="hot-controls__chip"
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
      </div>
    </section>
  );
}
