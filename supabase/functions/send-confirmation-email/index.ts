import { Resend } from 'https://esm.sh/resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { user, email_data } = body
    
    if (!user?.email || !email_data) {
      throw new Error('Dados de email inválidos')
    }

    const { token_hash, email_action_type, redirect_to } = email_data
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <tr>
              <td style="background: linear-gradient(135deg, hsl(217, 91%, 60%), hsl(217, 91%, 70%)); padding: 40px 30px; border-radius: 8px 8px 0 0; text-align: center;">
                <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin: 0;">🎓 Bem-vindo à Plataforma de Estudos</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 30px;">
                <p style="color: #334155; font-size: 16px; line-height: 26px; margin: 16px 0;">
                  Olá! Obrigado por se cadastrar em nossa plataforma.
                </p>
                <p style="color: #334155; font-size: 16px; line-height: 26px; margin: 16px 0;">
                  Para começar a acessar nossos conteúdos educacionais, vídeoaulas, artigos e quizzes interativos, 
                  você precisa confirmar seu endereço de email.
                </p>
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${confirmationUrl}" target="_blank" style="background-color: hsl(217, 91%, 60%); border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; padding: 16px 40px;">
                    Confirmar Email
                  </a>
                </div>
                <p style="color: #64748b; font-size: 14px; line-height: 22px; margin: 24px 0 8px;">
                  Ou copie e cole este link no seu navegador:
                </p>
                <p style="color: hsl(217, 91%, 60%); font-size: 13px; line-height: 22px; word-break: break-all; margin: 0 0 24px;">
                  ${confirmationUrl}
                </p>
                <p style="color: #94a3b8; font-size: 14px; line-height: 22px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                  Se você não criou uma conta conosco, pode ignorar este email com segurança.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; background-color: #f8fafc; border-radius: 0 0 8px 8px;">
                <p style="color: #94a3b8; font-size: 12px; line-height: 20px; margin: 0; text-align: center;">
                  © 2025 Plataforma de Estudos. Todos os direitos reservados.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    const { error } = await resend.emails.send({
      from: 'Plataforma de Estudos <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Confirme seu email - Plataforma de Estudos',
      html,
    })
    
    if (error) {
      console.error('Erro ao enviar email:', error)
      throw error
    }

    console.log('Email de confirmação enviado com sucesso para:', user.email)

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (error: any) {
    console.error('Erro no send-confirmation-email:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code || 500,
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
