import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mrglvm.com.mx'),
  title: {
    default: 'Muy Respetable Gran Logia Valle de México',
    template: '%s | MRGLVM',
  },
  description: 'Muy Respetable Gran Logia Valle de México. Preservando la tradición masónica desde 1934.',
  keywords: ['masonería', 'logia', 'méxico', 'valle de méxico'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://mrglvm.com.mx',
    title: 'Muy Respetable Gran Logia Valle de México',
    description: 'Preservando la tradición masónica desde 1934.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MRGLVM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muy Respetable Gran Logia Valle de México',
    description: 'Preservando la tradición masónica desde 1934.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-institucional-fondo">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
