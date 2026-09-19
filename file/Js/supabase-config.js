// Paste only your browser-safe Supabase project URL and anon/publishable key here.
// Never paste a service_role key into a public website.
export const SUPABASE_URL = "SUPABASE_URL";
export const SUPABASE_ANON_KEY = "SUPABASE_ANON_KEY";

export const isSupabaseConfigured = () => {
  return SUPABASE_URL.startsWith("https://")
    && !SUPABASE_URL.includes("SUPABASE_URL")
    && SUPABASE_ANON_KEY.length > 30
    && !SUPABASE_ANON_KEY.includes("SUPABASE_ANON_KEY");
};
