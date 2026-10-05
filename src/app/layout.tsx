import type { Metadata, Viewport } from "next";
import { Archivo, Cinzel, Permanent_Marker } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-cinzel",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const marker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marker",
  display: "swap",
});

const siteUrl = "https://halloween-beddoe.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Halloween at Beddoe | Friday 30 October",
  description:
    "Pre-drinks at 3/41 Beddoe Avenue, Clayton, from 6pm on Friday 30 October 2026. Costume required, BYO drinks and snacks. Then Halloween Havoc at Ms Collins.",
  icons: {
    icon: [{ url: "/icon.jpg", type: "image/jpeg" }],
    apple: [{ url: "/icon.jpg", type: "image/jpeg" }],
  },
  openGraph: {
    title: "Halloween at Beddoe | Friday 30 October",
    description:
      "Pre-drinks at 3/41 Beddoe Avenue, Clayton, from 6pm. Costume required. Then Halloween Havoc at Ms Collins.",
    url: siteUrl,
    siteName: "Halloween at Beddoe",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Halloween at Beddoe — glowing jack-o'-lantern invite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Halloween at Beddoe | Friday 30 October",
    description:
      "Pre-drinks at 3/41 Beddoe Avenue, Clayton, from 6pm. Costume required.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#140705",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${archivo.variable} ${marker.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
