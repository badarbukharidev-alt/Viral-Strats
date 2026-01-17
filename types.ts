export interface VideoSearchResult {
  type: string;
  id: string;
  title: string;
  channel: string;
  views: string;
  published: string;
  duration: string;
  thumbnail: string;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: VideoSearchResult[];
}

export interface ChannelInfo {
  name: string;
  subscribers: string;
  url: string;
}

export interface VideoStats {
  views: string;
  likes: string;
  date: string;
}

export interface VideoDetails {
  id: string;
  title: string;
  channel: ChannelInfo;
  stats: VideoStats;
  tags: string[];
  description: string;
}

export interface AIStrategyResult {
  titleStrategy: string;
  hookScript: string;
  seoKeywords: string[];
  rawText: string;
}
