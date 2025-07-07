import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { NotificationContainer } from "./components/ui/notifications/NotificationContainer";
import { NotificationDemo } from "./components/ui/notifications/NotificationDemo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  // Opcional: puedes definir pesos específicos que necesites
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: "Chabad House of Boquete, Panama - Your Jewish Home in the Mountains",
    template: "%s | Chabad Boquete Panama"
  },
  description: "Welcome to Chabad House of Boquete, Panama. Kosher meals, Shabbat services, accommodations, and activities for Jewish travelers. Your spiritual home in the mountains.",
  keywords: ["Chabad", "Boquete", "Panama", "Kosher", "Jewish", "Shabbat", "Holidays", "Tourism", "Accommodations", "Activities", "Meals"],
  authors: [{ name: "Chabad House of Boquete" }],
  creator: "Chabad House of Boquete",
  publisher: "Chabad House of Boquete",
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
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chabadboquete.com',
    siteName: 'Chabad House of Boquete, Panama',
    title: 'Chabad House of Boquete, Panama - Your Jewish Home in the Mountains',
    description: 'Welcome to Chabad House of Boquete, Panama. Kosher meals, Shabbat services, accommodations, and activities for Jewish travelers.',
    images: [
      {
        url: '/assets/pictures/home/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Chabad House of Boquete, Panama - Scenic mountain view',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chabad House of Boquete, Panama - Your Jewish Home in the Mountains',
    description: 'Welcome to Chabad House of Boquete, Panama. Kosher meals, Shabbat services, accommodations, and activities for Jewish travelers.',
    images: ['/assets/pictures/home/hero.jpg'],
    creator: '@ChabadBoquete',
  },
  alternates: {
    canonical: 'https://chabadboquete.com',
  },
  category: 'Travel & Tourism',
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Chabad House of Boquete, Panama",
    "description": "Chabad House providing kosher meals, Shabbat services, and Jewish hospitality in Boquete, Panama",
    "url": "https://chabadboquete.com",
    "logo": "https://chabadboquete.com/assets/site/logo.png",
    "image": "https://chabadboquete.com/assets/pictures/home/hero.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Boquete",
      "addressRegion": "Chiriquí",
      "addressCountry": "Panama"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://chabadboquete.com/contact"
    },
    "sameAs": [
      "https://www.facebook.com/ChabadBoquete",
      "https://www.instagram.com/chabadboquete"
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "Shabbat Meals",
        "description": "Traditional Shabbat and holiday meals for visitors",
        "category": "Food Service"
      },
      {
        "@type": "Offer", 
        "name": "Accommodations",
        "description": "Kosher-friendly accommodation recommendations",
        "category": "Lodging"
      },
      {
        "@type": "Offer",
        "name": "Activities",
        "description": "Jewish cultural activities and tours in Boquete",
        "category": "Tourism"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NotificationProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <NotificationContainer />
           {/*  <NotificationDemo /> */}
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}