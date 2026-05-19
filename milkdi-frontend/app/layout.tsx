import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const BASE_URL = "https://www.milkdi.com";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Milkdi — Pure Milk Delivery Platform",
    template: "%s | Milkdi",
  },
  description:
    "Order 100% pure cow and buffalo milk from trusted local dairy farms — delivered fresh to your doorstep daily. No bottles. No pouches. Just pure milk.",
  keywords: [
    "milk delivery",
    "pure milk delivery",
    "cow milk delivery",
    "buffalo milk delivery",
    "fresh milk delivery",
    "milk delivery app India",
    "Milkdi",
    "dairy vendor platform",
    "pure milk home delivery",
  ],
  authors: [{ name: "DIFMO PRIVATE LIMITED.", url: BASE_URL }],
  creator: "DIFMO PRIVATE LIMITED.",
  publisher: "DIFMO PRIVATE LIMITED.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Milkdi",
    title: "Milkdi — Pure Milk Delivery Platform",
    description:
      "Order 100% pure cow and buffalo milk from trusted local dairy farms. Delivered fresh daily to your doorstep across India.",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Milkdi — Pure Milk Delivery Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@milkdi_in",
    creator: "@milkdi_in",
    title: "Milkdi — Pure Milk Delivery Platform",
    description:
      "Order 100% pure cow and buffalo milk from trusted local dairy farms. Delivered fresh daily to your doorstep across India.",
    images: [`${BASE_URL}/opengraph-image`],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/milkdi-icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  category: "shopping",
};

import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "sonner";
import Script from "next/script";

const GA_ID = "G-N5CJJXF69B";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "DIFMO PRIVATE LIMITED.",
      alternateName: "Milkdi",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/milkdi-logo.svg`,
        width: 200,
        height: 60,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-9455791624",
        contactType: "customer service",
        email: "milkdiservices@gmail.com",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: [
        "https://play.google.com/store/apps/details?id=com.difmo.milkdi",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Milkdi",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/products?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "MobileApplication",
      name: "Milkdi — Pure Milk Delivery",
      operatingSystem: "Android",
      applicationCategory: "ShoppingApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      installUrl: "https://play.google.com/store/apps/details?id=com.difmo.milkdi",
      publisher: { "@id": `${BASE_URL}/#organization` },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "50000" },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#business`,
      name: "Milkdi",
      image: `${BASE_URL}/opengraph-image`,
      url: BASE_URL,
      telephone: "+91-9455791624",
      email: "milkdiservices@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lucknow",
        addressRegion: "Uttar Pradesh",
        postalCode: "226010",
        addressCountry: "IN",
      },
      geo: { "@type": "GeoCoordinates", latitude: 26.8467, longitude: 80.9462 },
      priceRange: "₹40 – ₹120",
      servesCuisine: "Milk Delivery",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-[family-name:var(--font-space-grotesk)] antialiased`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Toaster richColors position="top-right" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
