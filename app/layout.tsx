import type { Metadata } from "next";
import {
  Bodoni_Moda,
  Geist_Mono,
  Instrument_Sans,
  Inter,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-lux",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["italic", "normal"],
  display: "swap",
});

/* Marketing-site faces. Bodoni Moda is a Didone: thin hairlines and high
   stroke contrast, which is what reads as luxury next to the black-and-gold palette.
   Both are variable, so no `weight` array — one file per style covers the
   whole range. The dashboard keeps Inter + Playfair. */
const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "La-fe Beauty Parlor — Phokeng, North West",
  description:
    "Makeup, lashes and nails at La-fe Beauty Parlor in Phokeng, North West. Open Monday–Sunday, 08:30–18:00. Book online.",
  applicationName: "La-fe Beauty Parlor",
  openGraph: {
    siteName: "La-fe Beauty Parlor",
    title: "La-fe Beauty Parlor",
    description:
      "Makeup, lashes and nails in Phokeng, North West. Book online.",
    locale: "en_ZA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${playfair.variable} ${bodoni.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
