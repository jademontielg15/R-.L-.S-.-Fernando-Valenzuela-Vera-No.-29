import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

/**
 * Antes las fuentes entraban por `@import url(fonts.googleapis.com)` dentro del
 * CSS: una petición en cascada, bloqueante y sin preload, que provocaba FOUT y
 * saltos de layout. `next/font` las auto-hospeda, las preloadea y calcula el
 * `size-adjust` de la fuente de respaldo para que el CLS sea cero.
 */
const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const serif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fvv29.com.mx'),
  title: {
    default: 'R:.L:.S:. Fernando Valenzuela Vera No. 29',
    template: '%s | FVV29',
  },
  description: 'R:.L:.S:. Fernando Valenzuela Vera No. 29. Preservando la tradición masónica desde 1934.',
  keywords: ['masonería', 'logia', 'méxico', 'cardenas', 'fraternidad', 'tradición', 'educación', 'caridad'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://fvv29.com.mx',
    title: 'R:.L:.S:. Fernando Valenzuela Vera No. 29',
    description: 'R:.L:.S:. Fernando Valenzuela Vera No. 29. Preservando la tradición masónica desde 1934.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FVV29 | Preservando la tradición masónica desde 1934',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'R:.L:.S:. Fernando Valenzuela Vera No. 29',
    description: 'R:.L:.S:. Fernando Valenzuela Vera No. 29. Preservando la tradición masónica desde 1934.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body className="bg-surface-page">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-navy-800 focus:px-4 focus:py-2 focus:text-content-inverse"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido" className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
