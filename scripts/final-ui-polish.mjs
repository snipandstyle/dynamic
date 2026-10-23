import fs from 'node:fs';
let f='components/AdminDashboardModal.tsx';fs.writeFileSync(f,fs.readFileSync(f,'utf8').replaceAll('in_progress','in_care'));
f='components/booking/PetPicker.tsx';let s=fs.readFileSync(f,'utf8');s=s.replace('compact=false}:{','compact=false,lockedPetType=false}:{').replace('compact?:boolean}', 'compact?:boolean;lockedPetType?:boolean}').replace('<button key={type} aria-pressed=', '<button key={type} disabled={lockedPetType&&pet.petType!==type} aria-pressed=');fs.writeFileSync(f,s);
f='components/booking/CustomizeBooking.tsx';s=fs.readFileSync(f,'utf8').replace('<PetPicker pet={pet} onChange=','<PetPicker pet={pet} lockedPetType={!!bundle} onChange=');fs.writeFileSync(f,s);
