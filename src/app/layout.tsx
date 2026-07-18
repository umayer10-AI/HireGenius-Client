import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "HireGenius AI — AI-Powered Job Portal",
    template: "%s | HireGenius AI",
  },
  description:
    "HireGenius AI helps candidates find jobs with AI resume tools, cover letters, recommendations, and career coaching — while recruiters hire faster.",
  openGraph: {
    title: "HireGenius AI",
    description: "Premium AI-powered job portal for candidates and recruiters.",
    url: "/",
    siteName: "HireGenius AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireGenius AI",
    description: "Premium AI-powered job portal for candidates and recruiters.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
