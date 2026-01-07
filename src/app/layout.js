import './globals.css';
import { Inter } from 'next/font/google'
import { structuredData, organizationStructuredData } from '../components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Emelifts | Lift with EME - Monthly Strength Program',
  description: 'Progressive at-home strength training with personalized coaching. Build strength, lean muscle, and confidence with structured programming. 800+ clients trained.',
  keywords: 'women strength training, at-home workouts, strength program, fitness coaching, personalized training, progressive overload, lean muscle, injury resilience',
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
    title: 'Emelifts | Lift with EME - Monthly',
    description: 'Progressive at-home strength training with personalized coaching. 800+ clients trained.',
    url: 'https://emelifts.com',
    siteName: 'Emelifts',
    images: [
      {
        url: '/emelifts.png',
        width: 1200,
        height: 630,
        alt: 'Emelifts - Fitness Coaching',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emelifts | Lift with EME - Monthly',
    description: 'Progressive at-home strength training with personalized coaching. 800+ clients trained.',
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
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}