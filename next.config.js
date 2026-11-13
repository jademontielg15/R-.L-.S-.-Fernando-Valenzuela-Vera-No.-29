/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseImagePattern = supabaseUrl
  ? (() => {
      const url = new URL(supabaseUrl);
      return {
        protocol: url.protocol.slice(0, -1),
        hostname: url.hostname,
        port: url.port,
        pathname: '/storage/v1/object/public/imagenes-galeria/**',
      };
    })()
  : null;

const nextConfig = {
  reactStrictMode: true,
  // Las imagenes placeholder del sitio se sirven desde picsum.photos y se
  // consumen con next/image, que exige declarar el host. Sin esta entrada,
  // /nosotros y /knights-builders lanzaban 500 al renderizar.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      ...(supabaseImagePattern ? [supabaseImagePattern] : []),
    ],
    qualities: [75, 100],
  },
  redirects: async () => {
    return [
      {
        source: '/historia-de-la-masonería',
        destination: '/historia',
        permanent: true,
      },
      {
        source: '/acerca-de-la-muy-respetable-gran-logia-del-valle-de-méxico',
        destination: '/nosotros',
        permanent: true,
      },
      {
        source: '/descubrelamasoneria',
        destination: '/masoneria',
        permanent: true,
      },
      {
        source: '/masonería',
        destination: '/masoneria',
        permanent: true,
      },
      {
        source: '/revistas-institucionales',
        destination: '/revista',
        permanent: true,
      },
      {
        source: '/knightsbuildersgrandchapter',
        destination: '/knights-builders',
        permanent: true,
      },
      {
        source: '/kings',
        destination: '/knights-builders',
        permanent: true,
      },
      {
        source: '/knights',
        destination: '/knights-builders',
        permanent: true,
      },
      {
        source: '/política-de-privacidad',
        destination: '/aviso-de-privacidad',
        permanent: true,
      },
      {
        source: '/70',
        destination: '/nosotros',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
