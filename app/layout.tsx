import React from 'react';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Snip & Style | Cage-Free Pet Boarding & Grooming Studio • Bengaluru',
  description:
    'Kanakapura Highway NH 948 convenient drop-off on your way out of Bangalore. Clean, climate-controlled cage-free boarding floor with stress relief, nature walks, and gentle grooming.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      sanctuary: {
                        forest: '#0B1A14',
                        moss: '#142E24',
                        sage: '#234C3D',
                        'sage-light': '#E9F1ED',
                        gold: '#D99B43',
                        'gold-hover': '#C58934',
                        'gold-light': '#FDF7EE',
                        pearl: '#FAF8F5',
                        sand: '#F2EDE4',
                        dark: '#0C1117',
                        charcoal: '#1A232D',
                      }
                    },
                    fontFamily: {
                      sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                      serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
                    }
                  }
                }
              }
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        {/* Razorpay Standard Web Checkout */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
        {/* Umami Privacy-Friendly Analytics */}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="f3ab6622-e4f8-42d4-ba39-a1bff5dc63ef"></script>
      </head>
      <body className="bg-[#FAF8F5] text-[#0C1117] font-sans selection:bg-[#D99B43]/30 selection:text-[#0C1117] antialiased">
        {children}
      </body>
    </html>
  );
}
