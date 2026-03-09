import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
         bg-gray-50 text-gray-900 relative h-5000 pt-35 sm:pt-44 overflow-x-hidden`}
      >
        <div
          className="bg-indigo-200 absolute top-[-6rem] 
        -z-10 right-[-25rem] h-[40rem] w-[60rem] rounded-full 
        blur-[10rem] sm:w-[75rem] md:right-[-33rem]
        lg:right-[-28rem] xl:right-[-15rem] 2xl:right-[-5rem]"
        ></div>
        <div
          className="bg-cyan-200 absolute top-[-1rem] 
        -z-10 left-[-25rem] h-[40rem] w-[55rem] rounded-full 
        blur-[10rem] sm:w-[65rem] md:left-[-33rem]   
        lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"
        ></div>
        <Header />
        {children}
      </body>
    </html>
  );
}
