/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/actress/:name/",
        destination: "/actress/:name",
        permanent: true,
      },
      {
        source: "/category/:name/",
        destination: "/category/:name",
        permanent: true,
      },
      {
        source: "/tag/:name/",
        destination: "/tag/:name",
        permanent: true,
      },
      {
        source: "/gif/:slug/",
        destination: "/gif/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/gifs/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
