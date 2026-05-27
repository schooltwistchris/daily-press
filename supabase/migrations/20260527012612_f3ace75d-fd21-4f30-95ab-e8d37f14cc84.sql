
REVOKE SELECT, UPDATE, DELETE ON public.launch_requests FROM anon, authenticated;

CREATE POLICY "Deny all SELECT on launch_requests"
  ON public.launch_requests
  AS RESTRICTIVE
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "Deny all UPDATE on launch_requests"
  ON public.launch_requests
  AS RESTRICTIVE
  FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "Deny all DELETE on launch_requests"
  ON public.launch_requests
  AS RESTRICTIVE
  FOR DELETE
  TO anon, authenticated
  USING (false);
