"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GROOMING } from "../data/catalog";
import { putBookingItem } from "../utils/booking-cart";

// Kept as a bridge for older informational components. Checkout lives at /checkout.
export interface BookingDetails {
  type: "boarding" | "grooming";
  serviceName: string;
  basePrice: number;
  origPrice?: number;
  petType?: "dog" | "cat";
  petSize?: "small" | "medium" | "large";
  catType?: "neutered" | "non-neutered";
  petBreed?: string;
  nights?: number;
  appliedCouponCode?: string;
  couponCode?: string;
}
export default function CheckoutModal({
  isOpen,
  initialBooking,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialBooking?: BookingDetails;
  isFullPage?: boolean;
}) {
  const router = useRouter();
  useEffect(() => {
    if (!isOpen) return;
    const name = initialBooking?.serviceName.toLowerCase() || "";
    const service = GROOMING.find(
      (s) => name.includes(s.name.toLowerCase()) || name.includes(s.id),
    );
    if (initialBooking && (initialBooking.type === "boarding" || service)) {
      putBookingItem({
        id: crypto.randomUUID(),
        serviceId:
          initialBooking.type === "boarding" ? "boarding" : service!.id,
        category: initialBooking.type,
        petType: initialBooking.petType || "dog",
        petSize: initialBooking.petSize || "small",
        catType: initialBooking.catType || "neutered",
        nights: initialBooking.nights || 1,
        quantity: 1,
        addons: [],
        breed: initialBooking.petBreed,
      });
      router.replace("/cart");
    } else router.replace("/grooming#services");
  }, [isOpen, initialBooking, router]);
  return isOpen ? <p role="status">Opening your booking…</p> : null;
}
export { CheckoutModal };
