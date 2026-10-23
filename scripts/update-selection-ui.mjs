import fs from 'node:fs';
const f='components/booking/ReferenceStorefront.tsx';let s=fs.readFileSync(f,'utf8');
s=s.replace('  GROOMING,\n','').replace('  SIZE_LABELS,\n','');
s=s.replace('import CustomizeBooking from "./CustomizeBooking";',`import CustomizeBooking from "./CustomizeBooking";
import PetPicker from "./PetPicker";
import CompletePriceMenu from "./CompletePriceMenu";
import { priceSize } from "../../data/pet-selection";
import { PRIMARY_GROOMING, packageDetails } from "../../data/package-details";`);
let a=s.indexOf('export const dogBreeds =');let b=s.indexOf('const images =',a);s=s.slice(0,a)+s.slice(b);
s=s.replace('  const [nights, setNights] = useState(4);','  const [selectionMode,setSelectionMode]=useState<"breed"|"size">("breed");\n  const [nights, setNights] = useState(4);');
s=s.replace('    petSize = size,','    petSize?: PetSize,').replace('    petSize,\n    catType,','    petSize: petSize ?? (selectionMode === "breed" ? priceSize(breed,category,size) : size),\n    selectionMode,\n    catType,');
a=s.indexOf('  const selection =');b=s.indexOf('  function switchMode',a);
s=s.slice(0,a)+`  const groomSize=makeItem("furry-fresh","grooming").petSize;
  const selection=species === "cat" ? "Cat" : groomSize+" breed";
  function changePet(changes:Partial<BookingItem>){if(changes.petType)setSpecies(changes.petType);if(changes.petSize)setSize(changes.petSize);if(changes.breed!==undefined)setBreed(changes.breed);if(changes.catType)setCatType(changes.catType);if(changes.selectionMode)setSelectionMode(changes.selectionMode);}
`+s.slice(b);
a=s.indexOf('  const speciesControl =');b=s.indexOf('  return (\n    <div className="ref-storefront">',a);s=s.slice(0,a)+s.slice(b);
a=s.indexOf('              {speciesControl}');b=s.indexOf('            <div className="restore-stay-totals">',a);
s=s.slice(0,a)+`            </div>
            <PetPicker compact pet={makeItem("boarding","boarding")} onChange={changePet}/>
            {species === "cat" && <label className="restore-field exact-cat-type">Cat type<select aria-label="Boarding cat type" value={catType} onChange={e=>setCatType(e.target.value as typeof catType)}><option value="neutered">Neutered / spayed</option><option value="non-neutered">Not neutered</option></select></label>}
`+s.slice(b);
a=s.indexOf('        <div className="restore-groom-filter">');b=s.indexOf('        <div\n          className="ref-grooming-rail"',a);
s=s.slice(0,a)+`        <div className="restore-groom-filter"><PetPicker pet={makeItem("furry-fresh","grooming")} onChange={changePet}/></div>
`+s.slice(b);
s=s.replace('{GROOMING.map((service, index) => {','{PRIMARY_GROOMING.map((baseService, index) => {\n            const service=packageDetails(baseService.id,species);');
s=s.replace('      <StayStory />','      <CompletePriceMenu pet={makeItem("furry-fresh","grooming")} onRequest={setDraft}/>\n      <StayStory />');
s=s.replace('["GROOM10", "10% extra off", "Grooming packages above ₹999"],','["UPFRONT PRICES", "No price surprises", "Grooming packages from ₹499"],');
s=s.replace('code === "GROOM10"','code === "UPFRONT PRICES"');
s=s.replace('GROOM10 gives an extra 10% off grooming packages above ₹999. ','Package and bundle prices are exactly as listed. ');
fs.writeFileSync(f,s);
const hero='components/booking/LandingHero.tsx';let h=fs.readFileSync(hero,'utf8');a=h.indexOf('        <div className="landing-eyebrow">');b=h.indexOf('        <h1>',a);h=h.slice(0,a)+h.slice(b);h=h.replace('        </h1>','        </h1>\n        <p className="exact-hero-subtitle">Bangalore’s #1 cage-free boarding &amp; pet grooming studio</p>');h=h.replace('10% extra off grooming (GROOM10) · 1 night free on 6+ nights','Exact upfront grooming prices · 1 night free on 6+ nights');fs.writeFileSync(hero,h);
const ui='components/booking/BookingUI.tsx';let u=fs.readFileSync(ui,'utf8');a=u.indexOf('            <img',u.indexOf('aria-label="Snip and Style home"'));b=u.indexOf('          </Link>',a);u=u.slice(0,a)+`            <span className="exact-brand-seal"><Icon name="paw" size={17}/></span><span className="exact-brand-name">snip<span>&amp;</span>style<small>GOOD CARE. HAPPY PAWS.</small></span>
`+u.slice(b);u=u.replace('          <div className="pet-header-actions">','          <div className="pet-header-actions"><a className="exact-call-now" href="tel:+919739887770"><Icon name="phone" size={15}/><span>Call now</span></a>');u=u.replace('A little festive love: 10% off grooming above ₹999 · 1 night free on','Upfront grooming prices · 1 night free on');fs.writeFileSync(ui,u);
