import type { CreateHotItemInput } from '../domain/types.js';

const MAX_KEYWORD_BONUS = 30;
const DECAY_THRESHOLD_DAYS = 7;
const MAX_DECAY_POINTS = 30;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function countKeywordHits(text: string, keywords: string[]): number {
  return keywords.filter(keyword => text.includes(keyword)).length;
}

// 标题命中权重 2x，摘要命中权重 1x，去重后按比例计算
function calcRelevanceScore(item: CreateHotItemInput, keywords: string[]): number {
  if (keywords.length === 0) return 50;

  const titleHits = new Set(keywords.filter(k => item.title.includes(k)));
  const summaryHits = new Set(keywords.filter(k => item.summary.includes(k)));

  // 合并去重，标题命中记 2 份权重，摘要仅命中记 1 份
  const totalWeight = keywords.length * 2;
  let hitWeight = 0;
  for (const keyword of keywords) {
    if (titleHits.has(keyword)) {
      hitWeight += 2;
    } else if (summaryHits.has(keyword)) {
      hitWeight += 1;
    }
  }

  return clamp(Math.round((hitWeight / totalWeight) * 100), 0, 100);
}

function calcHeatScore(item: CreateHotItemInput, keywords: string[]): number {
  const baseScore = item.heatScore * 0.6;

  const titleHits = countKeywordHits(item.title, keywords);
  const summaryHits = countKeywordHits(item.summary, keywords);
  const totalHits = Math.min(titleHits + summaryHits, 3);
  const keywordBonus = Math.min(totalHits * 10, MAX_KEYWORD_BONUS) * 0.4;

  const publishedDate = new Date(item.publishedAt);
  const now = new Date();
  const ageInDays = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);

  // 超过 7 天才开始衰减，避免刚发布的热点被误降分
  let decayPenalty = 0;
  if (ageInDays > DECAY_THRESHOLD_DAYS) {
    const daysOverThreshold = ageInDays - DECAY_THRESHOLD_DAYS;
    decayPenalty = Math.min(daysOverThreshold * (MAX_DECAY_POINTS / DECAY_THRESHOLD_DAYS), MAX_DECAY_POINTS);
  }

  return clamp(Math.round(baseScore + keywordBonus - decayPenalty), 0, 100);
}

export function scoreItems(
  items: CreateHotItemInput[],
  keywords: string[]
): CreateHotItemInput[] {
  return items.map(item => ({
    ...item,
    heatScore: calcHeatScore(item, keywords),
    relevanceScore: calcRelevanceScore(item, keywords),
  }));
}
