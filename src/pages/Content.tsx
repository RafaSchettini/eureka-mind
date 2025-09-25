import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Play, 
  FileText, 
  Search,
  Filter,
  Clock,
  Star
} from "lucide-react";
import heroImage from "@/assets/hero-platform.jpg";

interface ContentItem {
  id: number;
  title: string;
  description: string;
  type: "video" | "article" | "pdf";
  duration: string;
  difficulty: "iniciante" | "intermediário" | "avançado";
  rating: number;
  thumbnail?: string;
}

export default function Content() {
  const contentItems: ContentItem[] = [
    {
      id: 1,
      title: "Introdução à Inteligência Artificial",
      description: "Conceitos fundamentais de IA, história e aplicações práticas no mundo moderno.",
      type: "video",
      duration: "45min",
      difficulty: "iniciante",
      rating: 4.8
    },
    {
      id: 2,
      title: "Estruturas de Dados em Python",
      description: "Aprenda listas, tuplas, dicionários e sets com exemplos práticos e exercícios.",
      type: "article",
      duration: "30min",
      difficulty: "intermediário",
      rating: 4.6
    },
    {
      id: 3,
      title: "Algoritmos de Machine Learning",
      description: "Guia completo sobre algoritmos de ML: regressão, classificação e clustering.",
      type: "pdf",
      duration: "2h",
      difficulty: "avançado",
      rating: 4.9
    },
    {
      id: 4,
      title: "Desenvolvimento Web com React",
      description: "Curso prático de React desde o básico até conceitos avançados como hooks e context.",
      type: "video",
      duration: "3h 20min",
      difficulty: "intermediário",
      rating: 4.7
    },
    {
      id: 5,
      title: "Banco de Dados SQL",
      description: "Fundamentos de SQL, consultas avançadas e design de banco de dados relacionais.",
      type: "article",
      duration: "1h 15min",
      difficulty: "iniciante",
      rating: 4.5
    },
    {
      id: 6,
      title: "Deep Learning e Redes Neurais",
      description: "Conceitos avançados de deep learning, CNN, RNN e transformers.",
      type: "pdf",
      duration: "4h",
      difficulty: "avançado",
      rating: 4.8
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "article":
        return <BookOpen className="w-4 h-4" />;
      case "pdf":
        return <FileText className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Biblioteca de Conteúdos
        </h1>
        <p className="text-muted-foreground">
          Explore nossa coleção curada de materiais de estudo em diversas áreas da tecnologia.
        </p>

        {/* Hero Image */}
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={heroImage} 
            alt="Plataforma de estudos com IA" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Aprenda com IA Personalizada</h2>
              <p className="text-white/90">Conteúdos adaptados ao seu ritmo e nível de conhecimento</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar conteúdos..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentItems.map((item) => (
          <Card key={item.id} className="shadow-card hover:shadow-card-hover transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getTypeIcon(item.type)}
                  <span className="text-xs uppercase font-medium">{item.type}</span>
                </div>
                <Badge variant="secondary" className={getDifficultyColor(item.difficulty)}>
                  {item.difficulty}
                </Badge>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{item.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-foreground font-medium">{item.rating}</span>
                </div>
              </div>
              
              <Button className="w-full bg-primary-gradient hover:opacity-90">
                Começar Estudo
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}