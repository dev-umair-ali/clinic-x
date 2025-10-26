import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayoutWrapper } from "@/components/layout/main-layout-wrapper";

// Use the `variable` option to define the font as a CSS variable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clinic AI - Healthcare Management Platform",
  description: "Modern healthcare management platform with AI-powered features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans min-h-screen overflow-x-hidden antialiased">
        <ReduxProvider>
          <ThemeProvider>
            <MainLayoutWrapper>{children}</MainLayoutWrapper>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
