
-- Create a table to track user course progress and scores
CREATE TABLE public.user_course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id INTEGER NOT NULL,
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER NOT NULL,
  course_score INTEGER DEFAULT 0,
  course_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create a table to track individual lesson completions
CREATE TABLE public.user_lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  course_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_course_progress
CREATE POLICY "Users can view their own course progress" 
  ON public.user_course_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own course progress" 
  ON public.user_course_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own course progress" 
  ON public.user_course_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for user_lesson_progress
CREATE POLICY "Users can view their own lesson progress" 
  ON public.user_lesson_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress" 
  ON public.user_lesson_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" 
  ON public.user_lesson_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to calculate total user score
CREATE OR REPLACE FUNCTION public.get_user_total_score(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(course_score), 0)::INTEGER
  FROM public.user_course_progress
  WHERE user_id = user_uuid;
$$;

-- Function to get user progress for a specific course
CREATE OR REPLACE FUNCTION public.get_user_course_progress(user_uuid UUID, course_id_param INTEGER)
RETURNS TABLE (
  lessons_completed INTEGER,
  total_lessons INTEGER,
  progress_percentage INTEGER,
  course_score INTEGER,
  course_completed BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(ucp.lessons_completed, 0),
    COALESCE(ucp.total_lessons, 0),
    CASE 
      WHEN COALESCE(ucp.total_lessons, 0) = 0 THEN 0
      ELSE ROUND((COALESCE(ucp.lessons_completed, 0)::FLOAT / ucp.total_lessons::FLOAT) * 100)::INTEGER
    END,
    COALESCE(ucp.course_score, 0),
    COALESCE(ucp.course_completed, false)
  FROM public.user_course_progress ucp
  WHERE ucp.user_id = user_uuid AND ucp.course_id = course_id_param
  UNION ALL
  SELECT 0, 0, 0, 0, false
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_course_progress 
    WHERE user_id = user_uuid AND course_id = course_id_param
  )
  LIMIT 1;
$$;
