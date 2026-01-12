import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { ThemeRegistry } from '@/components/ThemeRegistry';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { OrganizationSchema, SoftwareApplicationSchema } from '@/components/StructuredData';
import { roboto } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'VozenPark - Smart Vehicle Reminder System',
  description: 'Track your vehicle registration, insurance, and inspection dates. Get timely reminders before they expire.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/VozenPark_logo.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/favicon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VozenPark.mk',
  },
  // Additional SEO metadata
  keywords: ['vehicle', 'registration', 'reminder', 'insurance', 'inspection', 'Macedonia', 'возило', 'регистрација'],
  authors: [{ name: 'VozenPark.mk' }],
  creator: 'VozenPark.mk',
  publisher: 'VozenPark.mk',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'VozenPark - Smart Vehicle Reminder System',
    description: 'Track your vehicle registration, insurance, and inspection dates. Get timely reminders before they expire.',
    url: 'https://vozenpark.mk',
    siteName: 'VozenPark.mk',
    locale: 'mk_MK',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VozenPark - Smart Vehicle Reminder System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VozenPark - Smart Vehicle Reminder System',
    description: 'Track your vehicle registration, insurance, and inspection dates. Get timely reminders before they expire.',
    images: ['/og-image.png'],
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
  alternates: {
    canonical: 'https://vozenpark.mk',
    languages: {
      'mk': 'https://vozenpark.mk',
      'en': 'https://vozenpark.mk?lang=en',
      'sq': 'https://vozenpark.mk?lang=sq',
      'sr': 'https://vozenpark.mk?lang=sr',
      'tr': 'https://vozenpark.mk?lang=tr',
    },
  },
  verification: {
    // Add these once you have them
    // google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: '#1A73E8',
  width: 'device-width',
  initialScale: 1,
  // Removed maximumScale and userScalable to allow zoom for accessibility
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mk" className={roboto.variable}>
      <head>
        {/* Google Sans Font - loaded externally as it's not in next/font */}
        <link 
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link 
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Google+Sans+Text:wght@400;500;700&display=swap" 
          rel="stylesheet"
        />
        {/* Material Symbols */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" 
          rel="stylesheet"
        />
      </head>
      <body className={roboto.className}>
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="skip-link"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          Skip to main content
        </a>
        
        {/* Structured Data for SEO */}
        <OrganizationSchema />
        <SoftwareApplicationSchema />
        
        <ThemeRegistry>
          <main id="main-content">
            {children}
          </main>
        </ThemeRegistry>
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#323232',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
