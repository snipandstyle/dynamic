import fs from 'node:fs';import {execFileSync} from 'node:child_process';import dotenv from 'dotenv';dotenv.config({quiet:true});
const files=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const secrets=['DATABASE_URL','DIRECT_DATABASE_URL','JWT_SECRET','RAZORPAY_KEY_SECRET','RAZORPAY_WEBHOOK_SECRET'].map(k=>process.env[k]).filter(v=>v&&v.length>=8);
const hits=[];
for(const f of files){if(f.startsWith('artifacts/')||f==='tsconfig.tsbuildinfo'||!fs.existsSync(f)||!fs.statSync(f).isFile()||! /\.(tsx?|jsx?|mjs|cjs|json|md|html|yml|yaml|toml|ps1|example)$/.test(f))continue;const s=fs.readFileSync(f,'utf8');if(secrets.some(v=>s.includes(v))||/postgres(?:ql)?:\/\/[^\s'"<>]+:[^\s'"<>]+@/.test(s))hits.push(f);}
if(hits.length){console.log('Server credentials embedded in release files: '+hits.join(', '));process.exitCode=1;}else console.log('Release source scan passed; no configured server credentials or database passwords embedded.');
