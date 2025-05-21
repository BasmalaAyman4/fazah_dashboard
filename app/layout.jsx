"use client";

import { Cairo } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans`}>
        <SessionProvider>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
