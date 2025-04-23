import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// Updates the session for incoming requests.
// This function uses Supabase's server-side client to fetch the session and refresh it if necessary.
export async function updateSession(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(), // Retrieves all cookies from the request
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => {
            // Set cookies without options since `request.cookies.set` does not support options
            request.cookies.set(name, value);
          });
        },
      },
    }
  );

  // Fetches the current session from Supabase
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error.message);
    return NextResponse.redirect("/login"); // Redirects to login if session fetch fails
  }

  return NextResponse.next(); // Proceeds to the next middleware or route handler
}