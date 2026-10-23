import type { PetSize, PetType } from "./catalog";
export const DOG_BREEDS = [
  {name:"Shih Tzu",grooming:"small",boarding:"small"}, {name:"Pug",grooming:"small",boarding:"small"}, {name:"Maltese",grooming:"small",boarding:"small"},
  {name:"Beagle",grooming:"small",boarding:"medium"}, {name:"Frenchie",grooming:"small",boarding:"medium"},
  {name:"Labrador",grooming:"medium",boarding:"large"}, {name:"Golden Retriever",grooming:"medium",boarding:"large"}, {name:"Cocker Spaniel",grooming:"medium",boarding:"medium"},
  {name:"German Shepherd",grooming:"large",boarding:"large"}, {name:"Rottweiler",grooming:"large",boarding:"large"}, {name:"Husky",grooming:"large",boarding:"large"}, {name:"Indie / Desi Dog",grooming:"medium",boarding:"medium"},
] as const;
export type SelectionMode="breed"|"size";
export function priceSize(breed:string, category:string, fallback:PetSize):PetSize {
  const match=DOG_BREEDS.find(b=>b.name===breed);
  return match ? (category === "boarding" ? match.boarding : match.grooming) : fallback;
}
export function petNames(type:PetType){return type==="dog"?DOG_BREEDS.map(b=>b.name):["Persian Cat","Indie Cat","British Shorthair","Siamese","Maine Coon","Other cat breed"];}
