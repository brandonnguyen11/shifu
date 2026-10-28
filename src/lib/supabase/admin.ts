import { createClient } from "@supabase/supabase-js";

import {
  getSupabaseSecretKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

/** Server-only client; bypasses RLS. Never import from client components. */
export function createAdminClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  return createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
