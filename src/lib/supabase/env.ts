const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";

const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

const secretKey =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "";

export function isSupabaseConfigured() {
  return Boolean(url && publishableKey);
}

export function getSupabaseUrl() {
  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) in environment."
    );
  }
  return url;
}

export function getSupabasePublishableKey() {
  if (!publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in environment."
    );
  }
  return publishableKey;
}

export function getSupabaseSecretKey() {
  if (!secretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY in environment.");
  }
  return secretKey;
}
