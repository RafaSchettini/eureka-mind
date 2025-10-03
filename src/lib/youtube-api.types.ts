// Tipos para YouTube API
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: {
    default: string;
    medium: string;
    high: string;
    standard?: string;
    maxres?: string;
  };
  videoId: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  likeCount?: string;
  tags?: string[];
  categoryId?: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: {
    default: string;
    medium: string;
    high: string;
  };
  channelId: string;
  channelTitle: string;
  itemCount: number;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount?: string;
  videoCount?: string;
  viewCount?: string;
}

export interface YouTubeSearchResult {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId?: string;
    playlistId?: string;
    channelId?: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
    channelTitle: string;
    liveBroadcastContent: string;
  };
}

export interface YouTubeApiResponse<T> {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: T[];
}

export interface EducationalPlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // em minutos
  videoCount: number;
  channelTitle: string;
  subject: string;
}