import React from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./utilities.css";
import "./booking.css";
import "./reference.css";
import "./landing.css";
import "./restored.css";
import "./exact-booking.css";
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://snipandstyle.pet"),
  title: "Snip & Style | Pet Grooming & Cage-Free Boarding, Bengaluru",
  description:
    "Book online, visit our Kanakapura Main Road studio, and treat your dog or cat to gentle grooming or a cosy cage-free stay. Upfront prices and automatic offers.",
  icons: { icon: "/logo.png" },
  openGraph: {
    title: "Their happy place. Your peace of mind.",
    images: ["/images/generated/pet-happy-place.webp"],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#142b20",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={jakarta.variable}>
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="f3ab6622-e4f8-42d4-ba39-a1bff5dc63ef" data-domains="snipandstyle.pet,www.snipandstyle.pet" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
