
CREATE TABLE public.launch_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  city TEXT,
  state TEXT,
  pub_name TEXT,
  tagline TEXT,
  street TEXT,
  high_school TEXT,
  sections JSONB,
  has_ai_content BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.launch_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a launch request"
ON public.launch_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
