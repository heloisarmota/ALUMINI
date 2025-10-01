-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  course TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Ativo', 'Inativo')),
  enrollment_date DATE NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students
CREATE POLICY "Users can view all students"
  ON public.students
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own students"
  ON public.students
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own students"
  ON public.students
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own students"
  ON public.students
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for student photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-photos', 'student-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for student photos
CREATE POLICY "Anyone can view student photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'student-photos');

CREATE POLICY "Authenticated users can upload student photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'student-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their uploaded photos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'student-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their uploaded photos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'student-photos' 
    AND auth.role() = 'authenticated'
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create achievements table for gamification
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, type)
);

-- Enable RLS for achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements
CREATE POLICY "Users can view their own achievements"
  ON public.achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);