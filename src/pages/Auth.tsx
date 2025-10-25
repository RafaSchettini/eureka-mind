import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Loader2, BookOpen, Eye, EyeOff } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
});

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('signin');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup' || tab === 'signin') {
      setActiveTab(tab);
    }

    // Verificar se é um retorno de confirmação de email
    const handleEmailConfirmation = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        // Se há uma sessão ativa, significa que o email foi confirmado
        // Mas queremos deslogar o usuário para que ele faça login manualmente
        await supabase.auth.signOut();
        
        toast({
          title: "Email confirmado!",
          description: "Sua conta foi confirmada com sucesso. Faça login para continuar.",
        });
        
        // Garantir que está na aba de login
        setActiveTab('signin');
        
        // Limpar a URL para remover tokens de confirmação
        navigate('/auth?tab=signin', { replace: true });
      }
    };

    // Verificar se há tokens de confirmação na URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('access_token') || urlParams.has('refresh_token')) {
      handleEmailConfirmation();
    }
  }, [searchParams, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = authSchema.parse(formData);
      
      // Usar a URL atual correta para redirecionamento
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/auth?tab=signin&confirmed=true`;

      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: validatedData.fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Verifica se o usuário já está confirmado (já cadastrado)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          variant: "destructive",
          title: "Email já cadastrado",
          description: "Este email já está cadastrado no sistema.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('signin')}
              className="ml-auto"
            >
              Fazer login
            </Button>
          ),
        });
      } else {
        // Enviar email de confirmação customizado (se disponível)
        try {
          await supabase.functions.invoke('send-confirmation-email', {
            body: {
              email: validatedData.email,
              fullName: validatedData.fullName,
              confirmationUrl: redirectUrl
            }
          });
          
          // Email sent successfully
        } catch (emailError) {
          // Email sending failed, but Supabase already sent default email
          // Se falhar, o Supabase já enviou o email padrão
        }

        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta e depois faça login.",
        });
        
        // Limpar o formulário após cadastro bem-sucedido
        setFormData({
          email: '',
          password: '',
          fullName: '',
        });
        
        // Mudar para a aba de login
        setActiveTab('signin');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Dados inválidos",
          description: error.issues[0].message,
        });
      } else if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: String(error),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = authSchema.parse({
        email: formData.email,
        password: formData.password,
      });

      const { error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: "Email ou senha incorretos.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta!",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Dados inválidos",
          description: error.issues[0].message,
        });
      } else if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: String(error),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-elegant bg-clip-text text-transparent">
            Eureka AI
          </h1>
          <p className="text-muted-foreground">
            Sua plataforma inteligente de estudos
          </p>
        </div>

        <Card className="border-0 shadow-elegant">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Acesse sua conta</CardTitle>
            <CardDescription>
              {activeTab === 'signin' ? 
                'Entre com suas credenciais para continuar' : 
                'Crie uma nova conta para começar'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome completo</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar conta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;