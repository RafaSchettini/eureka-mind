import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouteHandler {
  method: string;
  pattern: RegExp;
  handler: (req: Request, match: RegExpMatchArray, supabase: any) => Promise<Response>;
}

// Utility function to create error response
const errorResponse = (message: string, status = 400) => {
  return new Response(
    JSON.stringify({ error: message }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

// Utility function to create success response
const successResponse = (data: any, status = 200) => {
  return new Response(
    JSON.stringify(data),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

// GET /contents - List all educational contents
const getContents = async (req: Request, _match: RegExpMatchArray, supabase: any) => {
  const url = new URL(req.url);
  const difficulty = url.searchParams.get('difficulty');
  const type = url.searchParams.get('type');
  const search = url.searchParams.get('search');

  let query = supabase.from('contents').select('*');

  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }
  if (type) {
    query = query.eq('type', type);
  }
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching contents:', error);
    return errorResponse(error.message, 500);
  }

  return successResponse({ contents: data, count: data.length });
};

// GET /contents/:id - Get specific content
const getContentById = async (_req: Request, match: RegExpMatchArray, supabase: any) => {
  const id = match[1];

  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching content:', error);
    return errorResponse(error.message, 404);
  }

  return successResponse({ content: data });
};

// GET /progress - Get user progress
const getUserProgress = async (req: Request, _match: RegExpMatchArray, supabase: any) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return errorResponse('Authorization header required', 401);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (userError || !user) {
    return errorResponse('Unauthorized', 401);
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching progress:', error);
    return errorResponse(error.message, 500);
  }

  return successResponse({ progress: data, count: data.length });
};

// POST /progress - Create or update user progress
const createProgress = async (req: Request, _match: RegExpMatchArray, supabase: any) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return errorResponse('Authorization header required', 401);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (userError || !user) {
    return errorResponse('Unauthorized', 401);
  }

  const progressSchema = z.object({
    content_id: z.string().uuid('content_id deve ser um UUID válido'),
    completed: z.boolean().optional(),
    time_spent: z.number().int().min(0).optional(),
    score: z.number().min(0).max(100).optional()
  });

  const body = await req.json();
  const validationResult = progressSchema.safeParse(body);

  if (!validationResult.success) {
    return errorResponse(`Dados inválidos: ${validationResult.error.message}`);
  }

  const { content_id, completed, time_spent, score } = validationResult.data;

  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      content_id,
      completed: completed || false,
      time_spent: time_spent || 0,
      score: score || 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating progress:', error);
    return errorResponse(error.message, 500);
  }

  return successResponse({ progress: data }, 201);
};

// GET /study-sessions - Get user study sessions
const getStudySessions = async (req: Request, _match: RegExpMatchArray, supabase: any) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return errorResponse('Authorization header required', 401);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (userError || !user) {
    return errorResponse('Unauthorized', 401);
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');

  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching study sessions:', error);
    return errorResponse(error.message, 500);
  }

  return successResponse({ sessions: data, count: data.length });
};

// POST /study-sessions - Create a new study session
const createStudySession = async (req: Request, _match: RegExpMatchArray, supabase: any) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return errorResponse('Authorization header required', 401);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (userError || !user) {
    return errorResponse('Unauthorized', 401);
  }

  const sessionSchema = z.object({
    content_id: z.string().uuid().optional(),
    duration: z.number().int().min(0).max(86400).optional(),
    focus_score: z.number().min(0).max(100).optional()
  });

  const body = await req.json();
  const validationResult = sessionSchema.safeParse(body);

  if (!validationResult.success) {
    return errorResponse(`Dados inválidos: ${validationResult.error.message}`);
  }

  const { content_id, duration, focus_score } = validationResult.data;

  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: user.id,
      content_id,
      duration: duration || 0,
      focus_score: focus_score || 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating study session:', error);
    return errorResponse(error.message, 500);
  }

  return successResponse({ session: data }, 201);
};

// GET /achievements - Get user achievements
const getAchievements = async (req: Request, _match: RegExpMatchArray, supabase: any) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return errorResponse('Authorization header required', 401);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (userError || !user) {
    return errorResponse('Unauthorized', 401);
  }

  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    return errorResponse(error.message, 500);
  }

  return successResponse({ achievements: data, count: data.length });
};

// POST /quiz/attempt - Record quiz attempt
const createQuizAttempt = async (req: Request, _match: RegExpMatchArray, supabase: any) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return errorResponse('Authorization header required', 401);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (userError || !user) {
    return errorResponse('Unauthorized', 401);
  }

  const quizSchema = z.object({
    quiz_id: z.string().uuid('quiz_id deve ser um UUID válido'),
    score: z.number().min(0).max(100),
    total_questions: z.number().int().min(1).optional(),
    correct_answers: z.number().int().min(0).optional(),
    time_spent: z.number().int().min(0).optional()
  });

  const body = await req.json();
  const validationResult = quizSchema.safeParse(body);

  if (!validationResult.success) {
    return errorResponse(`Dados inválidos: ${validationResult.error.message}`);
  }

  const { quiz_id, score, total_questions, correct_answers, time_spent } = validationResult.data;

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: user.id,
      quiz_id,
      score,
      total_questions: total_questions || 0,
      correct_answers: correct_answers || 0,
      time_spent: time_spent || 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating quiz attempt:', error);
    return errorResponse(error.message, 500);
  }

  return successResponse({ attempt: data }, 201);
};

// GET /stats - Get user statistics
const getUserStats = async (req: Request, _match: RegExpMatchArray, supabase: any) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return errorResponse('Authorization header required', 401);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );

  if (userError || !user) {
    return errorResponse('Unauthorized', 401);
  }

  // Get progress count
  const { data: progressData } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('completed', true);

  // Get total study time
  const { data: sessionsData } = await supabase
    .from('study_sessions')
    .select('duration')
    .eq('user_id', user.id);

  const totalStudyTime = sessionsData?.reduce((acc: number, session: any) => acc + (session.duration || 0), 0) || 0;

  // Get achievements count
  const { data: achievementsData } = await supabase
    .from('achievements')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id);

  // Get quiz stats
  const { data: quizData } = await supabase
    .from('quiz_attempts')
    .select('score, total_questions')
    .eq('user_id', user.id);

  const totalQuizzes = quizData?.length || 0;
  const averageScore = totalQuizzes > 0
    ? quizData.reduce((acc: number, quiz: any) => acc + (quiz.score || 0), 0) / totalQuizzes
    : 0;

  return successResponse({
    stats: {
      completed_contents: progressData?.length || 0,
      total_study_time: totalStudyTime,
      achievements_count: achievementsData?.length || 0,
      quizzes_completed: totalQuizzes,
      average_quiz_score: Math.round(averageScore * 100) / 100
    }
  });
};

// Define routes
const routes: RouteHandler[] = [
  { method: 'GET', pattern: /^\/contents$/, handler: getContents },
  { method: 'GET', pattern: /^\/contents\/([^\/]+)$/, handler: getContentById },
  { method: 'GET', pattern: /^\/progress$/, handler: getUserProgress },
  { method: 'POST', pattern: /^\/progress$/, handler: createProgress },
  { method: 'GET', pattern: /^\/study-sessions$/, handler: getStudySessions },
  { method: 'POST', pattern: /^\/study-sessions$/, handler: createStudySession },
  { method: 'GET', pattern: /^\/achievements$/, handler: getAchievements },
  { method: 'POST', pattern: /^\/quiz\/attempt$/, handler: createQuizAttempt },
  { method: 'GET', pattern: /^\/stats$/, handler: getUserStats },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Initialize Supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace('/learning-api', '');

    console.log(`${req.method} ${pathname}`);

    // Find matching route
    for (const route of routes) {
      if (route.method === req.method) {
        const match = pathname.match(route.pattern);
        if (match) {
          return await route.handler(req, match, supabaseClient);
        }
      }
    }

    // No route matched
    return errorResponse('Endpoint not found', 404);
  } catch (error) {
    console.error('Unexpected error:', error);
    return errorResponse('Internal server error', 500);
  }
});
