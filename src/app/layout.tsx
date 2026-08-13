import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { Toaster } from "sonner";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cart Shopper",
  description: "A premium online store for physical goods. Browse, add to cart, checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
return (
<html lang="en" className={`${fraunces.variable} ${inter.variable}`} data-scroll-behavior="smooth">
  <body className="flex min-h-dvh flex-col antialiased">
    <AppShell>{children}</AppShell>
    <Toaster richColors position="bottom-right" />
  </body>
</html>
);
}
