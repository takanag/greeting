import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "オンライン年賀状作成ページ",
  description: "年賀状の代替Webページ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

