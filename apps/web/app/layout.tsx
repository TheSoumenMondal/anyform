import type { Metadata } from "next";
import localFont from "next/font/local";
import "@xyflow/react/dist/style.css";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

// Cormorant Garamond
const cormorantGaramond = localFont({
  src: "./fonts/CormorantGaramond-Regular.woff",
  variable: "--font-cormorant-garamond",
});

const instrumentalSerif = localFont({
  src: "./fonts/InstrumentSerifRegular.woff",
  variable: "--font-instrumental-serif",
});

export const metadata: Metadata = {
  title: "anyform",
  description: "A form builder for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentalSerif.variable} ${cormorantGaramond.variable}`}
      >
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
