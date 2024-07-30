import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import KakaoAdfitScript from "@/components/ads/adfit";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freeder",
  description: "자유를 찾아 방황하는자",
  applicationName: "Freeder:재테크 내공공",
  keywords: ["낙원계산기", "경제적자유", "은퇴계산기", "재테크"],
  icons: "/logo.png",
  openGraph: {
    url:"http://keep-ones.me",
    title: "Freeder",
    description: "자유를 찾아 방황하는자",
    siteName: "Freeder",
    images: [{url: 'http://keep-ones.me/logo.png'}]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <KakaoAdfitScript />
      <GoogleAnalytics gaId="UA-61646850-3" />
    </html>
  );
}
