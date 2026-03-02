import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Survey App",
  description: "Sondaggi one-question-per-page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={inter.variable}>
      <body className="min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
