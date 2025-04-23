import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*", // Apply middleware to admin routes
    "/dashboard/:path*", // Example: Apply to other protected routes
  ],
};
