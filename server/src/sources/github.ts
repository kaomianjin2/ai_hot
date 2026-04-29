import type { SourceAdapter } from './types.js';
import type { CreateHotItemInput } from '../domain/types.js';

const GITHUB_SEARCH_API = 'https://api.github.com/search/repositories';

interface GithubRepo {
  full_name: string;
  description: string | null;
  html_url: string;
  topics: string[];
  stargazers_count: number;
  pushed_at: string;
}

interface GithubSearchResponse {
  items: GithubRepo[];
}

export function createGithubAdapter(query: string = 'AI'): SourceAdapter {
  return {
    name: 'github',
    async fetch(): Promise<CreateHotItemInput[]> {
      const url = `${GITHUB_SEARCH_API}?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20`;

      let response: Response;
      try {
        response = await fetch(url, {
          headers: {
            'User-Agent': 'AI-Hot-Radar/1.0',
            'Accept': 'application/vnd.github.v3+json',
          },
        });
      } catch (error) {
        console.error('[createGithubAdapter] fetch failed:', error);
        return [];
      }

      if (!response.ok) {
        console.error(`[createGithubAdapter] non-200 response: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json() as GithubSearchResponse;

      return (data.items ?? []).map((repo) => ({
        source: 'github' as const,
        title: repo.full_name,
        summary: (repo.description ?? '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ''),
        url: repo.html_url,
        tags: repo.topics ?? [],
        heatScore: Math.min(100, Math.floor(repo.stargazers_count / 1000)),
        relevanceScore: 50,
        publishedAt: repo.pushed_at,
      }));
    },
  };
}
