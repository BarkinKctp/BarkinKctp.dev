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
    "Barkin is a software engineer specializing in cloud computing, distributed systems, and devops with 2.5 years of experience.",
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
         bg-gray-50 text-gray-900 relative h-5000`}
      >
        <div
          className="bg-[#fbe2e3] absolute top-[-6rem] 
        -z[-2.5rem] right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full 
        blur-[10rem] sm:w-[68.75rem]"
        ></div>
        <div
          className="bg-[#dbd7fb] absolute top-[-1rem] 
        -z[-2.5rem] left-[-35rem] h-[31.25rem] w-[50rem] rounded-full 
        blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] 
        lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"
        ></div>
        <Header />
        {children}
      </body>
    </html>
  );
}
