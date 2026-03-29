import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import { getMetadataBaseUrl } from "@/lib/site-url";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const defaultTitle = "Valemonte — Italian Luxury Menswear";
const defaultDescription =
  "True style doesn't shout. Discover impeccable Neapolitan tailoring, fine fabrics, and timeless menswear crafted by third-generation Italian artisans.";

export const metadata = {
  metadataBase: new URL(getMetadataBaseUrl()),
  title: {
    default: defaultTitle,
    template: "%s | Valemonte",
  },
  description: defaultDescription,
  keywords: ["luxury menswear", "Italian tailoring", "Neapolitan jacket", "bespoke suits", "Valemonte"],
  applicationName: "Valemonte",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Valemonte",
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#0e0d0b",
  width: "device-width",
  initialScale: 1,
};

import StoryblokProvider from "@/components/StoryblokProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${inter.variable}`}>
        <StoryblokProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </StoryblokProvider>
      </body>
    </html>
  );
}
