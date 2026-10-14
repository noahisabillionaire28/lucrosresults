/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Call Queue PWA lives in /public/calls (static, add-to-home-screen app)
  async rewrites() {
    return [{ source: '/calls', destination: '/calls/index.html' }];
  },
  async headers() {
    return [
      { source: '/calls/sw.js', headers: [{ key: 'Service-Worker-Allowed', value: '/calls' }, { key: 'Cache-Control', value: 'no-cache' }] },
      { source: '/calls/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
    ];
  },
};
export default nextConfig;
