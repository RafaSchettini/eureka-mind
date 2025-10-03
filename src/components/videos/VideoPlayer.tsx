import { useState } from 'react';
import { KhanAcademyVideo } from '@/lib/external-apis.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, BookOpen, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  video: KhanAcademyVideo;
  autoplay?: boolean;
  onVideoEnd?: () => void;
  onVideoProgress?: (progress: number) => void;
}

export function VideoPlayer({ video, autoplay = false, onVideoEnd, onVideoProgress }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${video.youtube_id}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    showinfo: '0',
    iv_load_policy: '3',
    modestbranding: '1'
  })}`;

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'algebra': 'bg-blue-100 text-blue-800',
      'arithmetic': 'bg-green-100 text-green-800',
      'programming-intro': 'bg-purple-100 text-purple-800',
      'algorithms': 'bg-indigo-100 text-indigo-800',
      'physics-motion': 'bg-orange-100 text-orange-800',
      'cells': 'bg-emerald-100 text-emerald-800',
      'atoms': 'bg-red-100 text-red-800',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {video.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex-shrink-0"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-3 mt-3">
          <Badge variant="outline" className={getSubjectColor(video.subject_slug)}>
            {video.domain_slug}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {formatDuration(video.duration)}
          </div>
          <Badge variant="secondary">Khan Academy</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Player de vídeo */}
        <div className={cn(
          "relative aspect-video bg-black",
          isFullscreen && "fixed inset-0 z-50 aspect-auto"
        )}>
          <iframe
            src={embedUrl}
            title={video.title}
            className="w-full h-full"
            allowFullScreen
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          
          {/* Overlay de controles personalizados (opcional) */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button
                size="lg"
                className="bg-white/90 hover:bg-white text-black shadow-lg"
                onClick={() => setIsPlaying(true)}
              >
                <Play className="w-5 h-5 mr-2" />
                Assistir Vídeo
              </Button>
            </div>
          )}
        </div>

        {/* Informações adicionais */}
        <div className="p-6 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Tópico:</span>
              <span className="font-medium capitalize">{video.topic_slug.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Duração:</span>
              <span className="font-medium">{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              <a
                href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Ver no YouTube
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para lista de vídeos
interface VideoGridProps {
  videos: KhanAcademyVideo[];
  onVideoSelect: (video: KhanAcademyVideo) => void;
  selectedVideo?: KhanAcademyVideo;
}

export function VideoGrid({ videos, onVideoSelect, selectedVideo }: VideoGridProps) {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Nenhum vídeo encontrado</h3>
        <p className="text-muted-foreground">
          Tente ajustar seus filtros ou buscar por outros termos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card
          key={video.id}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-md",
            selectedVideo?.id === video.id && "ring-2 ring-primary"
          )}
          onClick={() => onVideoSelect(video)}
        >
          <div className="relative aspect-video bg-gray-100">
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full object-cover rounded-t-lg"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-white/90 rounded-full p-3">
                <Play className="w-6 h-6 text-gray-900" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-base leading-tight line-clamp-2">
              {video.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {video.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {video.domain_slug}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Khan Academy
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Componente para busca e filtros de vídeos
interface VideoFiltersProps {
  onSearch: (query: string) => void;
  onTopicSelect: (topic: string) => void;
  topics: string[];
  selectedTopic?: string;
}

export function VideoFilters({ onSearch, onTopicSelect, topics, selectedTopic }: VideoFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Busca */}
        <div>
          <label className="text-sm font-medium mb-2 block">Buscar vídeos</label>
          <input
            type="text"
            placeholder="Digite o assunto ou palavra-chave..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          />
        </div>

        {/* Filtro por tópico */}
        <div>
          <label className="text-sm font-medium mb-2 block">Filtrar por tópico</label>
          <select
            value={selectedTopic || ''}
            onChange={(e) => onTopicSelect(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="">Todos os tópicos</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}