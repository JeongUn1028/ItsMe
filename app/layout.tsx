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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f0e4" },
    { media: "(prefers-color-scheme: dark)", color: "#15110d" },
  ],
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
    //* data-theme 은 아래 스크립트가 클라이언트에서 넣으므로 서버 HTML 과 달라도 경고하지 않도록 합니다.
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 저장된 테마를 첫 페인트 전에 적용해 라이트→다크 깜빡임(FOUC)을 막습니다. ThemeToggle.applyTheme 과 같은 규칙. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`,
          }}
        />
      </head>
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
