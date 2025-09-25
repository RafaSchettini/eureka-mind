import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Send, 
  Sparkles, 
  MessageCircle,
  Lightbulb,
  BookOpen,
  User
} from "lucide-react";

interface ChatMessage {
  id: number;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export default function TutorAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "ai",
      content: "Olá! Sou seu tutor de IA personalizado. Como posso ajudá-lo hoje? Posso explicar conceitos, resolver dúvidas ou criar exercícios personalizados para você.",
      timestamp: "14:30",
      suggestions: [
        "Explique algoritmos de ordenação",
        "Crie um quiz sobre estruturas de dados",
        "Como funciona machine learning?",
        "Exercícios de programação"
      ]
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: messages.length + 2,
        role: "ai",
        content: "Ótima pergunta! Vou explicar isso de forma didática e adaptada ao seu nível de conhecimento...",
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Pode dar exemplos práticos?",
          "Crie exercícios sobre isso",
          "Qual o próximo tópico?"
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Brain className="w-8 h-8 text-accent" />
          Tutor IA Personalizado
        </h1>
        <p className="text-muted-foreground">
          Seu assistente inteligente para esclarecer dúvidas e acelerar seu aprendizado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col shadow-card">
            <CardHeader className="bg-accent-gradient text-white">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Chat com Tutor IA
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Online
                </Badge>
              </CardTitle>
            </CardHeader>
            
            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "ai" && (
                    <div className="w-8 h-8 bg-accent-gradient rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] space-y-2`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp}
                      </span>
                    </div>
                    
                    {/* AI Suggestions */}
                    {message.role === "ai" && message.suggestions && (
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
            
            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua pergunta ou dúvida..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-primary-gradient hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Topics */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                Tópicos Rápidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "Algoritmos de Ordenação",
                "Estruturas de Dados",
                "Machine Learning",
                "Programação Web",
                "Banco de Dados"
              ].map((topic) => (
                <Button
                  key={topic}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => setInputMessage(`Me explique sobre ${topic}`)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {topic}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* AI Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas da Sessão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Perguntas hoje:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tempo total:</span>
                <span className="font-medium">45min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tópicos cobertos:</span>
                <span className="font-medium">8</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}