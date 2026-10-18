"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import BookingHome from "./components/booking/ReferenceStorefront";
import { BookingShell } from "./components/booking/BookingUI";
import { putBookingItem } from "./utils/booking-cart";
import { BookingItem } from "./data/catalog";

const BoardingPage = dynamic(() => import("./components/BoardingPage"));
const ServicesPage = dynamic(() => import("./components/ServicesPage"));
const OffersAndPosters = dynamic(() => import("./components/OffersAndPosters"));
const AboutPage = dynamic(() => import("./components/AboutPage"));
const ReviewsPage = dynamic(() => import("./components/ReviewsPage"));
const SafetyPage = dynamic(() => import("./components/SafetyPage"));
const GalleryPage = dynamic(() => import("./components/GalleryPage"));
const ContactPage = dynamic(() => import("./components/ContactPage"));
const MeetThePackPage = dynamic(() => import("./components/MeetThePackPage"));

export type PageId =
  | "home"
  | "boarding"
  | "grooming"
  | "bundles"
  | "offers"
  | "about"
  | "reviews"
  | "safety"
  | "gallery"
  | "contact"
  | "pack"
  | "admin"
  | "account";

export interface AppProps {
  initialPage?: PageId;
}

export default function App({ initialPage = "home" }: AppProps) {
  const router = useRouter();

  const handleBooking = React.useCallback(
    (details?: any) => {
      if (!details) {
        router.push("/cart");
        return;
      }
      const category =
        details.type === "boarding" || details.category === "boarding"
          ? "boarding"
          : details.type === "addon" || details.category === "addon"
            ? "addon"
            : details.type === "bundle" || details.category === "bundle"
              ? "bundle"
              : "grooming";

      let serviceId = details.serviceId || details.id;
      if (!serviceId) {
        if (category === "boarding") serviceId = "boarding";
        else if (category === "addon") serviceId = "teeth-brushing";
        else serviceId = "furry-fresh";
      }

      // Map any legacy IDs if passed
      if (serviceId === "dog-furry-fresh" || serviceId === "cat-furry-fresh") serviceId = "furry-fresh";
      if (serviceId === "dog-special" || serviceId === "cat-special") serviceId = "special-package";
      if (serviceId === "dog-style" || serviceId === "cat-style") serviceId = "style-your-pet";
      if (serviceId === "dog-full-grooming" || serviceId === "cat-full-grooming") serviceId = "full-grooming";

      const item: BookingItem = {
        id: `${category}-${Date.now()}`,
        serviceId,
        category,
        petType: details.petType || details.pet || "dog",
        petSize: details.petSize || details.dogSize || "small",
        catType: details.catType || "neutered",
        nights: details.nights || (category === "boarding" ? 4 : 1),
        quantity: 1,
        addons: details.addons || [],
        petName: details.petName || details.name,
        breed: details.breed,
      };
      putBookingItem(item);
      router.push("/cart");
    },
    [router],
  );

  useEffect(() => {
    const open = (e: any) => {
      if (e?.detail) {
        handleBooking(e.detail);
      } else {
        router.push("/grooming");
      }
    };
    window.addEventListener("snip_open_booking", open);
    return () => window.removeEventListener("snip_open_booking", open);
  }, [router, handleBooking]);

  const navigate = (page: string) =>
    router.push(page === "home" ? "/" : `/${page}`);

  const props = {
    onNavigate: navigate,
    onOpenBooking: handleBooking,
  };

  return (
    <BookingShell active={initialPage}>
      {initialPage === "home" ? (
        <BookingHome page="home" />
      ) : initialPage === "boarding" ? (
        <div className="pet-legacy">
          <BoardingPage onNavigate={navigate} onOpenBooking={handleBooking} />
        </div>
      ) : initialPage === "grooming" ? (
        <div className="pet-legacy">
          <ServicesPage
            onNavigate={navigate}
            onOpenBooking={handleBooking}
            initialTab="packages"
          />
        </div>
      ) : initialPage === "bundles" ? (
        <div className="pet-legacy">
          <ServicesPage
            onNavigate={navigate}
            onOpenBooking={handleBooking}
            initialTab="bundles"
          />
        </div>
      ) : initialPage === "offers" ? (
        <div className="pet-legacy" style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 16px" }}>
          <OffersAndPosters onOpenBooking={handleBooking} />
        </div>
      ) : (
        <div className="pet-legacy">
          {initialPage === "about" ? (
            <AboutPage {...props} />
          ) : initialPage === "reviews" ? (
            <ReviewsPage {...props} />
          ) : initialPage === "safety" ? (
            <SafetyPage {...props} />
          ) : initialPage === "gallery" ? (
            <GalleryPage {...props} />
          ) : initialPage === "contact" ? (
            <ContactPage {...props} />
          ) : initialPage === "pack" ? (
            <MeetThePackPage {...props} />
          ) : (
            <BookingHome />
          )}
        </div>
      )}
    </BookingShell>
  );
}
