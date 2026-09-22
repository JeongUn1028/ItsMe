import type { Metadata, Viewport } from "next";
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
    //* 이미지는 app/opengraph-image.png 파일 규약으로 자동 주입됩니다.
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JEONGUN's Portfolio",
    description: "이정운의 포트폴리오 사이트입니다.",
  },
};

//* iOS Safari: 상단 바를 페이지 배경색으로 물들이고, 노치/홈 인디케이터 영역까지 콘텐츠가 확장되도록 합니다.
export const viewport: Viewport = {
  themeColor: "#f6f0e4",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
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
