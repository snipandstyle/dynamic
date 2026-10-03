'use client';

import React from 'react';
import AccountPage from '../../components/AccountPage';

export default function Page() {
  return (
    <AccountPage
      onNavigateHome={() => (window.location.href = '/')}
      onOpenBooking={() => (window.location.href = '/#grooming')}
    />
  );
}
