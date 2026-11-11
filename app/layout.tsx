import React from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./utilities.css";
import "./booking.css";
import "./reference.css";
import "./landing.css";
import "./restored.css";
import "./exact-booking.css";
import SuspendedNotice from "../components/SuspendedNotice";

// Set to false to restore original website immediately
export const IS_SITE_SUSPENDED = true;

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://snipandstyle.pet"),
  title: "Website Suspended | Snip & Style",
  description:
    "This website has been temporarily suspended due to outstanding service invoices.",
  icons: { icon: "/logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#090d16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={jakarta.variable}>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>
        {IS_SITE_SUSPENDED ? <SuspendedNotice /> : children}
      </body>
    </html>
  );
}
