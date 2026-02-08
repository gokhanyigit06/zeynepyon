import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteData } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeynep Yön - Writer",
  description: "Personal website of Zeynep Yön, a writer.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getSiteData();
  const { branding } = data;

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans text-stone-900 bg-white dark:bg-stone-950 dark:text-stone-50 transition-colors duration-300 flex flex-col min-h-screen`}
      >
        <Header logoText={branding?.logoText} logoUrl={branding?.logoUrl} menuItems={branding?.menuItems} />
        <main className="pt-24 flex-grow px-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <Footer stores={data.book?.stores} data={data.footer} />
      </body>
    </html>
  );
}
