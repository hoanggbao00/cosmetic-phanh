import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { OpenGraph } from "@/lib/og";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <NextTopLoader showSpinner={false} />
          <Toaster richColors theme="system" position="bottom-right" duration={2000} closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
