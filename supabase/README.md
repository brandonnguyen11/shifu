# Supabase setup

1. Open your project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. **Authentication → Providers** — enable Email.
3. **Authentication → URL configuration** — set Site URL to `http://localhost:3000` and add redirect `http://localhost:3000/**`.
4. For local dev, turn **off** “Confirm email” (or use the confirmation link after sign-up).
5. **SQL Editor** — paste and run `migrations/001_profiles_and_messaging.sql`.

After migration, register demo users:

- Tutor: `sarah@roomline.com`
- Student: `emma@roomline.com`

Sign in as either user; the app links them for messaging automatically.
