import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Supabase URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Anon key with list and read permissions

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useSupabase() {
  return { supabase };
}
