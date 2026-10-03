import type { Metadata } from "next";
import { Bodoni_Moda, Karla } from "next/font/google";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  title: "30 October, Beddoe Avenue",
  description:
    "Friday 30 October, 6:00 until 10:00 at 3/41 Beddoe Avenue, Clayton. Halloween costume required. Then Halloween Havoc at Ms Collins.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bodoni.variable} ${karla.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
