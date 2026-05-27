import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// This client points at the daily-press-publisher project.
// Its URL and anon key are public-by-design Supabase credentials;
// security is enforced by RLS on the publisher side.
const PUBLISHER_SUPABASE_URL = "https://ftkfufxjgpvmwyqmizii.supabase.co";
const PUBLISHER_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0a2Z1ZnhqZ3B2bXd5cW1pemlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Mzc2ODMsImV4cCI6MjA5NTMxMzY4M30.YLSdPmq3WN2FQ0mFIr8IyDY9ZZ9hOp3SxYxtnn0kEKk";

export const publisherSupabase: SupabaseClient<any> = createClient(
  PUBLISHER_SUPABASE_URL,
  PUBLISHER_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);
