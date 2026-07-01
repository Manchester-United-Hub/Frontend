import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { TanstackQueryProvider } from './providers';
import { Navbar } from '@widgets/Navbar';
import { MainFooter } from '@widgets/Footer';
import './globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '100 900',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'sans-serif',
  ],
});

export const metadata: Metadata = {
  title: 'Manchester United FC Hub',
  description: 'Manchester United FC에 대한 내용을 다루는 팬 페이지',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <TanstackQueryProvider>{children}</TanstackQueryProvider>
        <MainFooter />
      </body>
    </html>
  );
}
