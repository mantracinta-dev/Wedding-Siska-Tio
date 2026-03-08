import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export type DatabaseClient = SupabaseClient | null;

export const supabase: DatabaseClient =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      })
    : null;

export const isSupabaseConfigured = Boolean(supabase);
