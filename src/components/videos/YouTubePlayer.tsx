import { useState } from 'react';
import { YouTubeVideo } from '@/lib/youtube-api.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Play, Clock, Search, ExternalLink, Maximize2, Minimize2, Calendar, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YouTubeVideoPlayerProps {
  video: YouTubeVideo;
  autoplay?: boolean;
  onVideoEnd?: () => void;
  onVideoProgress?: (progress: number) => void;
}

export function YouTubeVideoPlayer({ video, autoplay = false }: YouTubeVideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${video.videoId}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    showinfo: '0',
    iv_load_policy: '3',
    modestbranding: '1'
  })}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 mb-2">{video.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(video.publishedAt)}
              </div>
              <div className="flex items-center gap-1">
                <span>Por: {video.channelTitle}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Player de vídeo */}
        <div className={cn(
          "relative aspect-video rounded-lg overflow-hidden bg-black",
          isFullscreen && "fixed inset-0 z-50 rounded-none aspect-auto"
        )}>
          <iframe
            src={embedUrl}
            title={video.title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Descrição do vídeo */}
        {video.description && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Descrição</h4>
            <p className="text-sm text-muted-foreground line-clamp-4">
              {video.description}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://youtube.com/watch?v=${video.videoId}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver no YouTube
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface YouTubeVideoGridProps {
  videos: YouTubeVideo[];
  onVideoSelect: (video: YouTubeVideo) => void;
  selectedVideo?: YouTubeVideo;
  loading?: boolean;
}

export function YouTubeVideoGrid({ videos, onVideoSelect, loading = false }: YouTubeVideoGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="aspect-video bg-muted" />
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhum vídeo encontrado</h3>
        <p className="text-muted-foreground">
          Tente ajustar os filtros ou fazer uma nova busca.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card
          key={video.id}
          className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden"
          onClick={() => onVideoSelect(video)}
        >
          {/* Thumbnail do vídeo */}
          <div className="relative aspect-video bg-muted overflow-hidden">
            <img
              src={video.thumbnail.medium || video.thumbnail.default}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center group-hover:bg-black/70 transition-colors duration-200">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-2 text-sm group-hover:text-primary transition-colors">
              {video.title}
            </CardTitle>
            <CardDescription className="text-xs">
              {video.channelTitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDate(video.publishedAt)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface YouTubeVideoFiltersProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: string) => void;
  onPlaylistSelect: (playlistId: string) => void;
  categories: string[];
  playlists: Array<{ id: string; title: string; subject?: string }>;
  selectedCategory?: string;
  selectedPlaylist?: string;
}

export function YouTubeVideoFilters({
  onSearch,
  onCategorySelect,
  onPlaylistSelect,
  categories,
  playlists,
  selectedCategory,
  selectedPlaylist
}: YouTubeVideoFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const categoryLabels: Record<string, string> = {
    'mathematics': 'Matemática',
    'programming': 'Programação',
    'science': 'Ciências',
    'technology': 'Tecnologia',
    'general': 'Geral'
  };

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      {/* Busca */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar vídeos educacionais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Buscar</Button>
      </form>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Filtro por categoria */}
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Categoria</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategorySelect(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category] || category}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por playlist */}
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Playlist Educacional</label>
          <select
            value={selectedPlaylist}
            onChange={(e) => onPlaylistSelect(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
          >
            <option value="">Todas as playlists</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.title} {playlist.subject && `(${playlist.subject})`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}