import type { Metadata, Viewport } from "next";
import { coupleNames } from "@/config/wedding";
import "./globals.css";

export const metadata: Metadata = {
  title: `${coupleNames} — A little forever`,
  description: "Dengan penuh cinta, kami mengundang Anda untuk menjadi bagian dari hari bahagia kami.",
  robots: { index: false, follow: false },
  openGraph: { title: `The Wedding of ${coupleNames}`, description: "Sebuah cerita, sebuah janji, dan awal dari selamanya.", locale: "id_ID", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f4f1e8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
