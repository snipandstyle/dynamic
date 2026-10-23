"use client";
import React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ReferenceStorefront from "./components/booking/ReferenceStorefront";
import { BookingShell } from "./components/booking/BookingUI";
const About = dynamic(() => import("./components/AboutPage"));
const Reviews = dynamic(() => import("./components/ReviewsPage"));
const Safety = dynamic(() => import("./components/SafetyPage"));
const Gallery = dynamic(() => import("./components/GalleryPage"));
const Contact = dynamic(() => import("./components/ContactPage"));
const Pack = dynamic(() => import("./components/MeetThePackPage"));
export type PageId =
  | "home"
  | "boarding"
  | "grooming"
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
  const props = {
    onNavigate: (page: string) =>
      router.push(page === "home" ? "/" : `/${page}`),
    onOpenBooking: () => router.push("/grooming#grooming-packages"),
  };
  const Component = {
    about: About,
    reviews: Reviews,
    safety: Safety,
    gallery: Gallery,
    contact: Contact,
    pack: Pack,
  }[initialPage as "about"];
  return (
    <BookingShell active={initialPage}>
      {Component ? (
        <div className="pet-legacy">
          <Component {...props} />
        </div>
      ) : (
        <ReferenceStorefront
          key={initialPage}
          page={
            initialPage === "grooming"
              ? "grooming"
              : initialPage === "boarding"
                ? "boarding"
                : "home"
          }
        />
      )}
    </BookingShell>
  );
}
