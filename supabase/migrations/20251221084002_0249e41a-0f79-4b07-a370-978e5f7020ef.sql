-- Create signups table for letter signups
CREATE TABLE public.signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  instagram TEXT,
  address TEXT NOT NULL,
  likes TEXT,
  listening TEXT,
  flower TEXT,
  colour TEXT,
  song TEXT,
  language TEXT,
  hindi_comfort TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visits table for tracking page visits
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public inserts (no auth required for this project)
ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert signups (public form)
CREATE POLICY "Anyone can insert signups" 
ON public.signups 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to insert visits (public tracking)
CREATE POLICY "Anyone can insert visits" 
ON public.visits 
FOR INSERT 
WITH CHECK (true);