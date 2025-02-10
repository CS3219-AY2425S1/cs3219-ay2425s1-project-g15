"use client";

import { ReactNode, Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import LoadingPage from "./common/LoadingPage";

const inter = Inter({
  subsets: ["latin"],
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body className="h-full w-full">
        <Suspense fallback={<LoadingPage />}>{children}</Suspense>
      </body>
    </html>
  );
};

export default Layout;
