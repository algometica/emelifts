import './globals.css';
import { Inter, Nunito } from 'next/font/google';
import { siteJsonLd } from '../components/StructuredData';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: true,
});

/** Rounded heavy display, same role as Apple’s SF Pro Rounded on product heroes. */
const nunitoHero = Nunito({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-hero-display',
  display: 'swap',
  adjustFontFallback: true,
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export const metadata = {
  title: 'Emelifts | Lift with EME. Strength coaching at home',
  description:
    'Stop guessing workouts. Coach-written strength training at home, with personal check-ins. 800+ women coached.',
  keywords:
    'women strength training, at-home workouts, strength program, fitness coaching, personalized training, progressive overload, lean muscle',
  authors: [{ name: 'Emelifts' }],
  creator: 'Emelifts',
  publisher: 'Emelifts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://emelifts.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Emelifts | Lift with EME',
    description:
      'Coach-led strength at home. Structured plan, real accountability. 800+ women coached.',
    url: 'https://emelifts.com',
    siteName: 'Emelifts',
    images: [
      {
        url: '/emelifts.png',
        width: 1200,
        height: 630,
        alt: 'Emelifts strength coaching',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emelifts | Lift with EME',
    description:
      'Coach-led strength at home. Structured plan, real accountability. 800+ women coached.',
    images: ['/emelifts.png'],
  },
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} ${inter.variable} ${nunitoHero.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
