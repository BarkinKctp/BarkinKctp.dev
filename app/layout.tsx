import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import ActiveSessionContextProvider from "./context/active-section-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barkin | Personal Portfolio",
  description:
    "Barkin is a software engineer specializing in cloud computing, \
     distributed systems, and devops with 2.5 years of experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
         bg-gray-50 text-gray-900 relative pt-35 sm:pt-44 overflow-x-hidden`}
      >
        <ActiveSessionContextProvider>
          <Header />
          {children}
        </ActiveSessionContextProvider>
      </body>
    </html>
  );
}
