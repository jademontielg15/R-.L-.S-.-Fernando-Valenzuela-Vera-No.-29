import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export function generateMetadata(props: SEOProps): Metadata {
  const { title, description, path = '', image } = props;
  const baseUrl = 'https://mrglvm.com.mx';
  const url = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/og-image.png`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: 'website',
      locale: 'es_MX',
      url,
      title,
      description,
      siteName: 'Muy Respetable Gran Logia Valle de México',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL('https://mrglvm.com.mx'),
  title: {
    default: 'Muy Respetable Gran Logia Valle de México',
    template: '%s | MRGLVM',
  },
  description:
    'Muy Respetable Gran Logia Valle de México. Preservando la tradición masónica desde 1934.',
  keywords: [
    'masonería',
    'logia',
    'méxico',
    'valle de méxico',
    'gran logia',
    'masonería mexico',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
