import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./flight-theme.css";
import Header from "@/components/header";
import ActiveSessionContextProvider from "./context/active-section-context";
import Footer from "@/components/footer";
import { Toaster } from "react-hot-toast";
import ThemeSwitch from "@/components/theme-switch";
import ThemeContextProvider from "./context/theme-context";
import VisitTracker from "@/components/visit-tracker";
import { BotIdClient } from "botid/client";

// Routes protected by Vercel BotID. The contact form's Server Action is invoked
// from the home page, so POST to "/" is what needs shielding.
const protectedRoutes = [{ path: "/", method: "POST" }];

const siteUrl = "https://barkinkocatepe.dev";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Barkin Kocatepe is a software engineer specializing in cloud computing, \
distributed systems, and DevOps, with 2.5 years of experience.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Barkin Kocatepe | Software Engineer",
    template: "%s | Barkin Kocatepe",
  },
  description,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Barkin Kocatepe",
    "software engineer",
    "cloud computing",
    "distributed systems",
    "DevOps",
    "portfolio",
  ],
  authors: [{ name: "Barkin Kocatepe", url: siteUrl }],
  creator: "Barkin Kocatepe",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Barkin Kocatepe",
    title: "Barkin Kocatepe | Software Engineer",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barkin Kocatepe | Software Engineer",
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <BotIdClient protect={protectedRoutes} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
        bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100
        transition-colors duration-300 relative pt-35 sm:pt-44 [overflow-x:clip]`}
      >
        <ThemeContextProvider>
          <ActiveSessionContextProvider>
            <Header />
            {children}
            <Footer />
            <Toaster position="top-right" />
            <ThemeSwitch />
            <VisitTracker />
          </ActiveSessionContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
