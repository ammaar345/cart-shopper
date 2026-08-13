"use client";

import { Header } from "./Header";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
