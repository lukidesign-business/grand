/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep the preview bundler on stable defaults; unsupported experimental flags
  // can leave stale webpack manifests and produce missing-chunk 500 errors.
  serverExternalPackages: ['drizzle-orm', 'pg'],
  images: {
    formats: ['image/avif', 'image/webp'],
    // Source art tops out around 1600px wide, so the 2048/3840 breakpoints only
    // ever produced upscaled files. Capping here keeps the srcset honest.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920]
  }
};

export default nextConfig;
