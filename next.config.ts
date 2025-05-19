import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'local-origin.dev',
    '*.local-origin.dev',
    'http://10.66.136.103:3000', // Add your local IP here
    'http://localhost:3000',     // Optional: allow localhost too
  ],
};

export default nextConfig;
