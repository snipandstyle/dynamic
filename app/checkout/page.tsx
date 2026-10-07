'use client';

import React, { Suspense } from 'react';
import CheckoutPage from '../../components/CheckoutPage';

export default function CheckoutRoute() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
          <div className="size-10 rounded-full border-4 border-sanctuary-forest border-t-transparent animate-spin mb-3" />
          <p className="text-sm font-bold text-sanctuary-dark">Loading Snip & Style Checkout...</p>
        </div>
      }
    >
      <CheckoutPage />
    </Suspense>
  );
}
