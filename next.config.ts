import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the ngrok tunnel host to load dev assets / HMR cleanly.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.app"],
};

export default nextConfig;
