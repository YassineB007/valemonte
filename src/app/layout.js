import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "Valemonte — Italian Luxury Menswear",
  description:
    "True style doesn't shout. Discover impeccable Neapolitan tailoring, fine fabrics, and timeless menswear crafted by third-generation Italian artisans.",
  keywords: ["luxury menswear", "Italian tailoring", "Neapolitan jacket", "bespoke suits", "Valemonte"],
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
