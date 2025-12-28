import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Handy Help NZ - Local help you can count on",
  description: "Professional lawn care for Dunedin homes. Run by William, a 15-year-old entrepreneur supported by 20 years of business experience.",
  openGraph: {
    title: "Handy Help NZ - Local help you can count on",
    description: "Professional lawn care for Dunedin homes. Run by William, a 15-year-old entrepreneur supported by 20 years of business experience.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Handy Help NZ Logo",
      },
    ],
    type: "website",
    siteName: "Handy Help NZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "Handy Help NZ - Local help you can count on",
    description: "Professional lawn care for Dunedin homes. Run by William, a 15-year-old entrepreneur supported by 20 years of business experience.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
