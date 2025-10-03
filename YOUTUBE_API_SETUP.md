# 🔧 Configuração da API do YouTube

## ⚠️ API Key Necessária

Para que as filtragens de vídeo funcionem corretamente, você precisa configurar uma chave da API do YouTube.

## 📋 Como obter a API Key

### 1. Acesse o Google Cloud Console
- Vá para: https://console.cloud.google.com/

### 2. Crie ou selecione um projeto
- Clique em "Criar Projeto" ou selecione um existente

### 3. Ative a YouTube Data API v3
- No menu lateral, vá em "APIs e Serviços" > "Biblioteca"
- Procure por "YouTube Data API v3"
- Clique em "Ativar"

### 4. Crie uma API Key
- Vá em "APIs e Serviços" > "Credenciais"
- Clique em "Criar Credenciais" > "Chave de API"
- Copie a chave gerada

## 🔑 Configuração no Projeto

### 1. Edite o arquivo `.env`
```bash
# Substitua YOUR_API_KEY_HERE pela sua chave real
VITE_YOUTUBE_API_KEY=SuaChaveAquiDaAPIDoYouTube
```

### 2. Reinicie o servidor de desenvolvimento
```bash
npm run dev
```

## ✅ Verificando se Funcionou

Após configurar a API key:

1. **Abra o DevTools** (F12)
2. **Vá na aba Console**
3. **Teste as filtragens**:
   - Busque por termos como "javascript", "matemática", "física"
   - Selecione diferentes categorias
   - Teste diferentes playlists

### ✅ **Se funcionou:** Você verá logs de sucesso no console
### ❌ **Se não funcionou:** Você verá mensagens de aviso sobre API key

## 🔍 Modo de Demonstração

**Sem API key configurada**, a aplicação roda em **modo de demonstração** com:
- 8 vídeos educacionais de exemplo
- Filtragens funcionais (por categoria e busca)
- Dados estáticos para teste

## 💡 Dicas

- **Gratuito**: A API do YouTube tem cota gratuita generosa
- **Segurança**: Nunca compartilhe sua API key publicamente
- **Limites**: Monitore o uso da API no Google Cloud Console

## 🚀 Recursos que Funcionam

### Com API Key:
- ✅ Busca real de vídeos educacionais
- ✅ Filtros por categoria dinâmicos
- ✅ Playlists reais do YouTube
- ✅ Metadados atualizados

### Sem API Key (Modo Demo):
- ✅ 8 vídeos de demonstração
- ✅ Filtros funcionais
- ✅ Interface completa
- ⚠️ Dados estáticos