'use client';

import React from 'react';
import CheckoutModal, { BookingDetails } from './CheckoutModal';

interface CheckoutPageProps {
  initialBooking?: BookingDetails;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ initialBooking }) => {
  return (
    <CheckoutModal
      isOpen={true}
      isFullPage={true}
      onClose={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }}
      initialBooking={initialBooking}
    />
  );
};

export default CheckoutPage;
