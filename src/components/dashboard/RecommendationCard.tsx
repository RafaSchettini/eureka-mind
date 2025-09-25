import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, FileText, Sparkles } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  description: string;
  type: "video" | "article" | "quiz" | "ai";
  difficulty: "iniciante" | "intermediário" | "avançado";
  estimatedTime: string;
  aiRecommended?: boolean;
}

export function RecommendationCard({
  title,
  description,
  type,
  difficulty,
  estimatedTime,
  aiRecommended = false,
}: RecommendationCardProps) {
  const getIcon = () => {
    switch (type) {
      case "video":
        return <Play className="w-5 h-5" />;
      case "article":
        return <FileText className="w-5 h-5" />;
      case "quiz":
        return <BookOpen className="w-5 h-5" />;
      case "ai":
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "iniciante":
        return "bg-success text-success-foreground";
      case "intermediário":
        return "bg-primary text-primary-foreground";
      case "avançado":
        return "bg-accent text-accent-foreground";
    }
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            {aiRecommended && (
              <Sparkles className="w-4 h-4 text-accent" />
            )}
          </div>
          <Badge variant="secondary" className={getDifficultyColor()}>
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {estimatedTime}
          </span>
          <Button size="sm" className="bg-primary-gradient hover:opacity-90">
            Começar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}