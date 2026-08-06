/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: {
    formats: ['image/avif', 'image/webp'],
    // Source art tops out around 1600px wide, so the 2048/3840 breakpoints only
    // ever produced upscaled files. Capping here keeps the srcset honest.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920]
  }
};

export default nextConfig;
