import type { CreateHotItemInput } from '../domain/types.js';

export interface SourceAdapter {
  name: string;
  fetch(): Promise<CreateHotItemInput[]>;
}

export type SourceConfig = {
  url: string;
  enabled: boolean;
};
