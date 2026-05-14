import { withSentryConfig } from '@sentry/nextjs';
import * as Sentry from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'img.clerk.com' }]
  }
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
  org: "sudhiksha-v",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true, // Add this line
  },
};

export default nextConfig;