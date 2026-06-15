import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { themeBootstrapScript } from "@/lib/theme";
import { AppNav } from "@/components/shell/AppNav";
import { SiteFooter } from "@/components/shell/SiteFooter";
import "./globals.css";

const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://onylogy-tools.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Onylogy Tools — Free Web Dev & Design Utilities",
    template: "%s · Onylogy Tools",
  },
  description:
    "Free, client-side tools for developers and designers: copy generator, PX-to-REM converter, CSS clamp() generator, and text case converter. No sign-up needed.",
  applicationName: "Onylogy Tools",
  authors: [{ name: "Onylogy", url: "https://onylogy.com" }],
  creator: "Onylogy",
  keywords: [
    "lorem ipsum generator",
    "mock data generator",
    "px to rem converter",
    "rem to px",
    "css clamp generator",
    "fluid typography calculator",
    "clamp() calculator",
    "case converter",
    "text case converter",
    "developer tools",
    "web design tools",
  ],
  openGraph: {
    type: "website",
    siteName: "Onylogy Tools",
    url: SITE_URL,
    title: "Onylogy Tools — Free Web Dev & Design Utilities",
    description:
      "A placeholder copy generator, PX↔REM converter, fluid CSS clamp() generator, and text case converter. Free, fast, and fully client-side.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Onylogy Tools — Free Web Dev & Design Utilities",
    description:
      "Copy generator, PX↔REM converter, fluid CSS clamp() generator, and case converter. Free & fully client-side.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-body">
        <AppNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
