import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Creates a Supabase client for server-side usage.
// This client is used in server-side components or API routes to interact with the Supabase database.
export const createClient = async () => {
  const cookieStore = await cookies(); // Get the cookies API

  // Convert cookies to an array of key-value pairs
  const cookieValues = cookieStore.getAll().map(({ name, value }) => ({
    name,
    value,
  }));

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase project URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Supabase public anonymous key
    {
      cookies: {
        getAll: () => cookieValues, // Return resolved cookie values
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value }) =>
              cookieStore.set(name, value) // Set cookies in the response
            );
          } catch {
            // Ignore errors if called from a Server Component
          }
        },
      },
    }
  );
};