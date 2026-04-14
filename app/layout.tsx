import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JEONGUN's Portfolio",
    template: "%s | JEONGUN's Portfolio",
  },
  description: "이정운의 포트폴리오 사이트입니다.",
  openGraph: {
    title: "JEONGUN's Portfolio",
    description: "이정운의 포트폴리오 사이트입니다.",
    url: siteUrl,
    siteName: "JEONGUN's Portfolio",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 630,
        alt: "JEONGUN portfolio preview",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JEONGUN's Portfolio",
    description: "이정운의 포트폴리오 사이트입니다.",
    images: ["/profile.jpg"],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* Portal로 렌더링되는 모달 전용 DOM 루트입니다. */}
        <div id="modal-root"></div>
        {/* @modal parallel route가 여기로 주입됩니다. */}
        {modal}
      </body>
    </html>
  );
}
