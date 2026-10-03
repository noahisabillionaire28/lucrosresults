/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      // /losangeles is the official URL. statusCode 301 (not `permanent: true`, which Next sends as 308).
      { source: "/los-angeles", destination: "/losangeles", statusCode: 301 },
    ];
  },
};
export default nextConfig;
