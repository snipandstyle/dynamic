"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
export interface BookingDetails { type: "boarding"|"grooming"; serviceName: string; basePrice: number; origPrice?: number; petType?: "dog"|"cat"; petSize?: "small"|"medium"|"large"; catType?: "neutered"|"non-neutered"; petBreed?: string; nights?: number; appliedCouponCode?: string; couponCode?: string }
interface Props { isOpen:boolean; onClose:()=>void; initialBooking?:BookingDetails; isFullPage?:boolean }
export function CheckoutModal({isOpen,initialBooking}:Props){const router=useRouter();const category=initialBooking?.type||"grooming";useEffect(()=>{if(isOpen)router.replace(`/${category}#${category}-packages`);},[isOpen,category,router]);return isOpen?<p role="status">Opening our studio booking menu…</p>:null;}
export default CheckoutModal;
