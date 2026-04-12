import type { Metadata } from "next";
import {
  Great_Vibes,
  Open_Sans,
  DM_Serif_Display,
  Cormorant_Garamond,
  Niconne,
} from "next/font/google";
import "./globals.css";

const display = DM_Serif_Display({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const nameStyle = Great_Vibes({
  weight: "400",
  variable: "--font-name-style",
  subsets: ["latin"],
});

const body = Open_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});


const cormorant = Cormorant_Garamond({
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
  subsets: ["latin"],
});

const niconne = Niconne({
  weight: "400",
  variable: "--font-niconne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Siska & Setio — Wedding Invitation",
    template: "%s | Siska & Setio Wedding",
  },
  description:
    "Undangan digital pernikahan Siska & Setio. Kami mengundang Anda untuk hadir dan berbagi kebahagiaan bersama kami.",

  // Metadata untuk SEO & Crawling
  authors: [{ name: "Siska & Setio" }],
  keywords: [
    "undangan digital",
    "wedding invitation",
    "Siska & Setio",
    "Pandeglang",
  ],
  openGraph: {
    title: "Siska & Setio Wedding Invitation",
    description:
      "Tanpa mengurangi rasa hormat, kami mengundang Anda untuk hadir di momen bahagia kami.",
    url: "https://www.harisiskatio.web.id",
    siteName: "Siska & Setio Wedding",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "https://www.harisiskatio.web.id/other/forever.webp",
        width: 1200,
        height: 630,
        alt: "Siska & Setio Wedding Invitation",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preload" as="image" href="/other/bg-green.jpg" />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${nameStyle.variable} ${cormorant.variable} ${niconne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
