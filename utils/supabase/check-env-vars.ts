// This check can be removed
// it is just for tutorial purposes
// Checks if the required environment variables for Supabase are set.
// This is useful for debugging and ensuring the app is properly configured.

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
