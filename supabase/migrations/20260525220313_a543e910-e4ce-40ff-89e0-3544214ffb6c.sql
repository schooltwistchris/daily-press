
DROP POLICY "Anyone can submit a launch request" ON public.launch_requests;

CREATE POLICY "Anyone can submit a launch request with valid email"
ON public.launch_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(email) > 3
  AND length(email) < 320
  AND email LIKE '%_@_%.__%'
);
