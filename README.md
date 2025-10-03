# 🧠 Eureka Mind - Plataforma de Estudos Inteligente

Uma plataforma moderna de aprendizado que integra vídeos educacionais do YouTube, artigos da Wikipedia e quizzes interativos para criar uma experiência de estudo personalizada e eficiente.

## ✨ Funcionalidades

### 📚 **Estudos**
- **🎥 Vídeoaulas**: Integração com API do YouTube para vídeos educacionais curados
  - Playlists educacionais organizadas por assunto
  - Busca inteligente com foco educacional
  - Player integrado com controles avançados
  - Categorias: Matemática, Programação, Ciências, Tecnologia

- **📖 Artigos**: Integração com Wikipedia para conteúdo educacional
  - Artigos científicos e educacionais
  - Busca por categoria e palavras-chave
  - Visualização otimizada para leitura
  - Conteúdo em português e inglês

### 🎯 **Questões**
- **Quiz Interativo**: Sistema de perguntas e respostas
  - Integração com Open Trivia Database
  - Diferentes categorias e níveis de dificuldade
  - Sistema de pontuação e progresso
  - Resultados detalhados com estatísticas

### 👤 **Sistema de Usuário**
- Autenticação segura com Supabase
- Progresso personalizado de estudos
- Histórico de atividades
- Sistema de conquistas

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Lucide React** para ícones

### Backend & Database
- **Supabase** (PostgreSQL)
  - Autenticação
  - Database em tempo real
  - Storage de arquivos

### APIs Externas
- **YouTube Data API v3** - Vídeos educacionais
- **Wikipedia API** - Artigos e conteúdo educacional
- **Open Trivia Database** - Questões para quizzes

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou bun
- Conta no Supabase
- YouTube Data API Key

### 1. Clone o repositório
```bash
git clone <repository-url>
cd eureka-mind
```

### 2. Instale as dependências
```bash
npm install
# ou
bun install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
VITE_YOUTUBE_API_KEY=sua_chave_youtube_api
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
```

### 4. Configure o banco de dados
Execute as migrations do Supabase que estão na pasta `supabase/migrations/`

### 5. Execute o projeto
```bash
npm run dev
# ou
bun dev
```

Acesse http://localhost:5173

## 📊 Estrutura do Banco de Dados

### Tabelas Principais
- `profiles` - Perfis de usuário
- `contents` - Conteúdos de estudo
- `user_progress` - Progresso dos usuários
- `study_sessions` - Sessões de estudo
- `achievements` - Sistema de conquistas
- `ai_conversations` - Conversas com IA
- `ai_messages` - Mensagens da IA

## 🔧 APIs e Integrações

### YouTube Data API v3
```typescript
// Buscar vídeos educacionais
const videos = await youtubeService.searchEducationalVideos('matemática');

// Carregar playlist
const playlistVideos = await youtubeService.getPlaylistVideos('PLAYLIST_ID');

// Vídeos por categoria
const categoryVideos = await youtubeService.getVideosByCategory('programming');
```

### Wikipedia API
```typescript
// Buscar artigos
const articles = await searchArticles('física quântica');

// Conteúdo educacional por categoria
const content = await getEducationalContent('mathematics');
```

### Open Trivia Database
```typescript
// Carregar questões
const questions = await loadQuestions({
  amount: 10,
  category: 9, // General Knowledge
  difficulty: 'medium'
});
```

## 🎨 Componentes Principais

### YouTube Player
- `YouTubeVideoPlayer` - Player de vídeo integrado
- `YouTubeVideoGrid` - Grid de vídeos com thumbnails
- `YouTubeVideoFilters` - Filtros e busca

### Quiz System
- `QuizSetup` - Configuração do quiz
- `QuizPlayer` - Interface de perguntas
- `QuizResults` - Resultados e estatísticas

### Article Components
- `ArticleViewer` - Visualizador de artigos
- `ArticleGrid` - Lista de artigos
- `ArticleFilters` - Filtros de artigos

## 📱 Design Responsivo

A aplicação é totalmente responsiva e otimizada para:
- 📱 Mobile (320px+)
- 📟 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1280px+)

## 🔐 Autenticação e Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) habilitado
- Proteção de rotas sensíveis
- Sanitização de dados de entrada

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

---

**Desenvolvido com ❤️ para democratizar o acesso à educação de qualidade**
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/68a03214-a185-4cb7-a603-1777c298f255) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
