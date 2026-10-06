import type { Metadata, Viewport } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { coupleNames, wedding } from "@/config/wedding";
import "./globals.css";
import "./editorial.css";

const shareTitle = `The Wedding of ${coupleNames}`;
const shareDescription = `${wedding.dayLabel}, ${wedding.dateLabel} · Dengan penuh cinta, kami mengundang Anda untuk menjadi bagian dari hari bahagia kami.`;
const shareImage = { url: "/images/image-4.jpeg", width: 878, height: 1278, alt: `Undangan pernikahan ${coupleNames}` };

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: `${coupleNames} — A little forever`,
  description: shareDescription,
  robots: { index: false, follow: false },
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    siteName: shareTitle,
    locale: "id_ID",
    type: "website",
    images: [{ ...shareImage, type: "image/jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [shareImage],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f4f1e8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
