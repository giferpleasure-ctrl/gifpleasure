/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  trailingSlash: false,
  async redirects() {
    return [
      // Существующие редиректы (без слеша)
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
      // НОВЫЕ РЕДИРЕКТЫ ДЛЯ _rsc (ВАЖНО: СНАЧАЛА КОРЕНЬ, ПОТОМ ВСЕ ПУТИ)
      {
        source: "/",
        has: [
          {
            type: "query",
            key: "_rsc",
          },
        ],
        destination: "/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "query",
            key: "_rsc",
          },
        ],
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Существующие заголовки
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
      // НОВЫЙ ЗАГОЛОВОК: ЗАПРЕТ ИНДЕКСАЦИИ ДЛЯ _rsc (ПОДСТРАХОВКА)
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, follow",
          },
        ],
        has: [
          {
            type: "query",
            key: "_rsc",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
