import { BookingItem, validateItem } from "../data/catalog";
const KEY = "snip_booking_cart_v2";
export function readBookingCart(): BookingItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "[]");
    if (!Array.isArray(value)) return [];
    return value.map(validateItem);
  } catch {
    return [];
  }
}
export function writeBookingCart(items: BookingItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items.map(validateItem)));
  window.dispatchEvent(new Event("snip_cart_updated"));
}
export function putBookingItem(item: BookingItem) {
  const items = readBookingCart();
  const same = items.findIndex(
    (i) =>
      i.serviceId === item.serviceId &&
      i.petType === item.petType &&
      i.petSize === item.petSize &&
      i.catType === item.catType &&
      i.nights === item.nights,
  );
  if (same < 0) items.push(item);
  else
    items[same] = {
      ...items[same],
      quantity: Math.min(5, items[same].quantity + 1),
    };
  writeBookingCart(items);
}
