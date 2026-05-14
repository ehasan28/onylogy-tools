import type { Metadata } from "next";
import { Bricolage_Grotesque, Montserrat, JetBrains_Mono } from "next/font/google";
import { themeBootstrapScript } from "@/lib/theme";
import "./globals.css";

const heading = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Onylogy Tools — Copy generator, PX converter, Clamp generator, Case converter",
    template: "%s · Onylogy Tools",
  },
  description:
    "A focused set of client-side web-dev tools: copy generator (lorem ipsum, mock data, identifiers), PX↔rem converter, fluid clamp() generator, and text case converter.",
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
      <body className="min-h-screen flex flex-col font-body">{children}</body>
    </html>
  );
}
