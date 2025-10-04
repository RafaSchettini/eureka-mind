import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, confirmationUrl } = await req.json();

    if (!email) {
      throw new Error("Email é obrigatório");
    }

    console.log("Enviando email de confirmação para:", email);

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirme seu cadastro - Eureka AI</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px -8px rgba(59, 130, 246, 0.25);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Eureka AI</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Plataforma Inteligente de Estudos</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">
                Bem-vindo${fullName ? `, ${fullName}` : ''}! 🎉
              </h2>
              
              <p style="color: #475569; margin: 0 0 25px; font-size: 16px; line-height: 1.6;">
                Estamos muito felizes em ter você conosco! Para começar sua jornada de aprendizado, precisamos confirmar seu endereço de email.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${confirmationUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.4);">
                  Confirmar meu email
                </a>
              </div>

              <p style="color: #64748b; margin: 30px 0 0; font-size: 14px; line-height: 1.6;">
                Ou copie e cole este link no seu navegador:
              </p>
              <div style="background: #f1f5f9; border-radius: 6px; padding: 12px; margin: 10px 0 0; word-break: break-all;">
                <code style="color: #475569; font-size: 13px; font-family: 'Courier New', monospace;">${confirmationUrl}</code>
              </div>

              <!-- Features -->
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                <h3 style="color: #1e293b; margin: 0 0 20px; font-size: 18px; font-weight: 600;">
                  O que você pode fazer no Eureka AI:
                </h3>
                <ul style="color: #475569; margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.8;">
                  <li>📚 Acessar conteúdos educacionais de qualidade</li>
                  <li>🎯 Realizar quizzes interativos e testar seus conhecimentos</li>
                  <li>📊 Acompanhar seu progresso de aprendizado</li>
                  <li>🤖 Interagir com nosso tutor de IA personalizado</li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; margin: 0; font-size: 13px; line-height: 1.6;">
                Se você não criou uma conta no Eureka AI, pode ignorar este email com segurança.
              </p>
              <p style="color: #cbd5e1; margin: 15px 0 0; font-size: 12px;">
                © ${new Date().getFullYear()} Eureka AI - Todos os direitos reservados
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { error } = await resend.emails.send({
      from: "Eureka AI <onboarding@resend.dev>",
      to: [email],
      subject: "Confirme seu cadastro no Eureka AI 🚀",
      html: emailHtml,
    });

    if (error) {
      console.error("Erro ao enviar email:", error);
      throw error;
    }

    console.log("Email enviado com sucesso para:", email);

    return new Response(
      JSON.stringify({ message: "Email enviado com sucesso" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Erro na função send-confirmation-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
