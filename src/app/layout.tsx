import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PRO ALI SMART | 스마트 제조 품질 혁신 플랫폼',
  description: '품질 운영의 하나로 연결된 워크플로우로 통합하세요. 제조 DX를 위한 스마트 제조 품질 혁신 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
