import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Dormant Supabase integration — activates automatically once both env vars
 * are set (see .env.example and SUPABASE.md). Until then every helper here
 * is a no-op and the app keeps running on localStorage.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function isSupabaseEnabled(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/** Returns the shared client, or null when Supabase is not configured. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseEnabled()) return null;
  if (!client) {
    // Non-null asserted: guarded by isSupabaseEnabled above.
    client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: { persistSession: false },
    });
  }
  return client;
}
