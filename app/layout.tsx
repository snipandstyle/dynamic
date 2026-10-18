import React from "react";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./utilities.css";
import "./booking.css";
import "./reference.css";
import "./landing.css";
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://snipandstyle.pet"),
  title: {
    default: "Snip & Style | Pet Grooming & Cage-Free Boarding, Bengaluru",
    template: "%s | Snip & Style",
  },
  description:
    "Gentle dog and cat grooming, cage-free boarding, and daily WhatsApp updates on Kanakapura Main Road, Bengaluru. See exact prices and book online.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Snip & Style",
    title: "Their happy place. Your peace of mind.",
    description:
      "Gentle grooming. Cosy cage-free stays. Kanakapura Main Road, Bengaluru.",
    images: [
      {
        url: "/images/generated/pet-happy-place.webp",
        width: 1536,
        height: 1024,
        alt: "Snip & Style pet grooming and boarding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Snip & Style — Your pet’s happy place",
    images: ["/images/generated/pet-happy-place.webp"],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#142b20",
};
const business = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Snip & Style",
  url: "https://snipandstyle.pet",
  telephone: "+919739887770",
  image: "https://snipandstyle.pet/logo.png",
  description: "Pet grooming and cage-free boarding for dogs and cats.",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Site no. 61, beside Shani Mahatma Temple, Kanakapura Main Road",
    addressLocality: "Bengaluru",
    postalCode: "560082",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:30",
      closes: "20:30",
    },
  ],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${jakarta.variable} ${cormorant.variable}`}>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(business).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="f3ab6622-e4f8-42d4-ba39-a1bff5dc63ef"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
