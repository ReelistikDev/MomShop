import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, Caveat } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/brand";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://momshop.example"),
  title: {
    default: `${BRAND.name} — A Handmade Boutique`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "A little handmade boutique — hats, earrings, shirts, stickers, and more, made and gathered with love. New shop opening soon.",
  openGraph: {
    title: `${BRAND.name} — A Handmade Boutique`,
    description:
      "A little handmade boutique — hats, earrings, shirts, stickers, and more, made with love.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}
