/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
        source: '/política-de-privacidad',
        destination: '/aviso-de-privacidad',
        permanent: true,
      },
      {
        source: '/política-de-privacidad-y-protección-de-d*',
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
