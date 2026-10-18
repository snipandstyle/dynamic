"use client";

import React from "react";
import AccountPage from "../../components/AccountPage";
import { BookingShell } from "../../components/booking/BookingUI";

export default function Page() {
  return (
    <BookingShell>
      <AccountPage
        onNavigateHome={() => (window.location.href = "/")}
        onOpenBooking={() => (window.location.href = "/grooming#services")}
      />
    </BookingShell>
  );
}
