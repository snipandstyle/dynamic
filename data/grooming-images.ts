import type { PetType } from "./catalog";

const services = new Set([
  "furry-fresh", "special-package", "style-your-pet", "full-grooming",
  "puppy-kitten-spa", "medicated-bath",
]);

/** One consistent service image across cards and booking dialogs. */
export function groomingImage(serviceId: string, petType: PetType) {
  const service = services.has(serviceId) ? serviceId : "full-grooming";
  return `/images/generated/grooming/${petType}-${service}.webp`;
}
