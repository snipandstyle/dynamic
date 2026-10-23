import { GROOMING, PetType } from "./catalog";
export const PRIMARY_GROOMING=GROOMING.slice(0,4);
export function packageDetails(id:string,type:PetType){
  const service=GROOMING.find(s=>s.id===id)!;
  if(type==="dog")return service;
  const cats:Record<string,{description:string;includes:readonly string[];note:string}>={
    "furry-fresh":{description:"Essential hygiene bath, comb out, ear and eye cleansing for cats.",includes:["Bath with Shampoo & Conditioner","Professional Blow Dry","Combing & Brushing","Ear Cleaning","Eye Cleaning"],note:"Excludes sanitary clipping, haircut, and full body trimming."},
    "special-package":{description:"Enhanced care with additional dental hygiene and paw care.",includes:["Bath with Shampoo & Conditioner","Blow Dry","Combing & Brushing","Ear & Eye Cleaning","Mouth Spray","Teeth Brushing","Paws Trimming"],note:"Enhanced hygiene and paw care."},
    "style-your-pet":{description:"Professional feline styling and neat trims.",includes:["Full Body Trimming","Face Trimming","Free Sanitary Clipping","Free Ear & Eye Cleaning","Free Mouth Spray"],note:"Bath is not included in this styling-only package."},
    "full-grooming":{description:"Complete grooming for cats including Lion Cut or Comb Cut if desired, full bath, and mat prevention.",includes:["Haircut (Lion/Comb Cut)","Bath with Shampoo & Conditioner","Nail Clipping","Ear & Eye Cleaning","Mat Removal","Deshedding Treatment"],note:"Discuss your preferred Lion Cut or Comb Cut at the studio."},
  };
  return {...service,...cats[id]};
}
