import "@/assets/styles/tailwind.css";
import { Toaster } from "@/components/ui/sonner";
import { OpenGraph } from "@/lib/config/open-graph";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...OpenGraph,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {children}
        <NextTopLoader showSpinner={false} color='#E19D7D' />
        <Toaster richColors theme='system' position='bottom-right' duration={2000} closeButton />
      </body>
    </html>
  );
}
