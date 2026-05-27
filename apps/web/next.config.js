/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // eslint-disable-next-line turbo/no-undeclared-env-vars, no-undef
    const backendUrl = process.env.RAILWAY_SERVICE_API_URL
      ? // eslint-disable-next-line turbo/no-undeclared-env-vars, no-undef
        `https://${process.env.RAILWAY_SERVICE_API_URL}`
      : "http://localhost:8000";

    return [
      {
        source: "/trpc/:path*",
        destination: `${backendUrl}/trpc/:path*`,
      },
    ];
  },
};

export default nextConfig;
