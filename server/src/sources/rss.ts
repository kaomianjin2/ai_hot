import Parser from 'rss-parser';
import type { SourceAdapter } from './types.js';
import type { CreateHotItemInput } from '../domain/types.js';

const DEFAULT_FEED_URL = 'https://hnrss.org/newest?q=AI';

export function createRssAdapter(feedUrl: string = DEFAULT_FEED_URL): SourceAdapter {
  const parser = new Parser();

  return {
    name: 'rss',
    async fetch(): Promise<CreateHotItemInput[]> {
      try {
        const feed = await parser.parseURL(feedUrl);
        return feed.items.map((item) => ({
          source: 'rss' as const,
          title: item.title ?? '',
          summary: item.contentSnippet ?? item.content ?? '',
          url: item.link ?? '',
          tags: item.categories ?? [],
          heatScore: 50,
          relevanceScore: 50,
          publishedAt: item.isoDate ?? new Date().toISOString(),
        }));
      } catch (error) {
        console.error(`[createRssAdapter] fetch failed for ${feedUrl}:`, error);
        return [];
      }
    },
  };
}
