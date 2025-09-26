import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Target, Users, LogIn, ArrowRight, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-platform.jpg";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-elegant bg-clip-text text-transparent">
              Eureka AI
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </Link>
            <Link to="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
            <Link to="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="outline">
                <Link to="/content">
                  <User className="mr-2 h-4 w-4" />
                  Minha Conta
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/auth">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Transforme seus estudos com{" "}
                <span className="bg-gradient-elegant bg-clip-text text-transparent">
                  Inteligência Artificial
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Plataforma completa de aprendizado com IA que se adapta ao seu ritmo e necessidades. 
                Conteúdos personalizados, tutor virtual e progresso inteligente.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button asChild size="lg" className="bg-gradient-elegant text-white border-0 hover:shadow-glow transition-all duration-300">
                  <Link to="/dashboard">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Acessar Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-gradient-elegant text-white border-0 hover:shadow-glow transition-all duration-300">
                    <Link to="/auth">
                      <LogIn className="mr-2 h-4 w-4" />
                      Começar Agora
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/auth">
                      Saiba Mais
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={heroImage} 
                alt="Plataforma de Estudos com IA" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Recursos Inteligentes para seu Aprendizado
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tecnologia avançada para maximizar seu potencial de aprendizado
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Brain,
              title: "Tutor IA",
              description: "Assistente virtual que responde suas dúvidas e explica conceitos no seu nível"
            },
            {
              icon: Target,
              title: "Aprendizado Personalizado",
              description: "Algoritmo inteligente que adapta o conteúdo ao seu progresso e estilo"
            },
            {
              icon: BookOpen,
              title: "Biblioteca Completa",
              description: "Acesso a textos, PDFs, vídeos e materiais organizados por tema"
            },
            {
              icon: Users,
              title: "Progresso Inteligente",
              description: "Acompanhamento detalhado com insights e recomendações personalizadas"
            }
          ].map((feature, index) => (
            <div key={index} className="group p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Eureka AI. Transformando a educação com inteligência artificial.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;