import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://owjbnwhsvzgxwltufftg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93amJud2hzdnpneHdsdHVmZnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk2MzE2ODQsImV4cCI6MjAzNTIwNzY4NH0.qEoP_sZjwdnmjbdssMvAWyfxQPKhHY2MHmo02K5Hag4";
//   Doing it like this exposes the key but we have it set in RLS to read-only
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
