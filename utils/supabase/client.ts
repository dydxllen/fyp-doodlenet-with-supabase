import { createBrowserClient } from "@supabase/ssr";

// Creates a Supabase client for browser-side usage.
// This client is used in client-side components to interact with the Supabase database.
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase project URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Supabase public anonymous key
  );