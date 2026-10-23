import fs from 'node:fs';import {spawnSync} from 'node:child_process';
fs.mkdirSync('artifacts/production',{recursive:true});const checks=[];
function run(name,args){const result=spawnSync(process.execPath,args,{encoding:'utf8',maxBuffer:16*1024*1024,env:process.env});fs.writeFileSync(`artifacts/production/final-${name}.log`,(result.stdout||'')+(result.stderr||''));checks.push({name,passed:result.status===0});console.log(name+': '+(result.status===0?'PASS':'FAIL'));if(result.status!==0){console.log((result.stdout||'')+(result.stderr||''));process.exitCode=1;}}
run('regressions',['--test','scripts/booking.test.cjs']);
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));run('lint',['node_modules/eslint/bin/eslint.js',...pkg.scripts['lint:booking'].replace(/^eslint /,'').split(' ')]);
run('build',['node_modules/next/dist/bin/next','build']);
fs.writeFileSync('artifacts/production/final-validation.json',JSON.stringify({checkedAt:new Date().toISOString(),checks},null,2));
