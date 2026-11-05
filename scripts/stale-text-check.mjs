#!/usr/bin/env node
// Before a push: player-facing Spanish texts that this change removed or rewrote in src/ or index.html, and the tests
// that still expect them. A text counts as gone only when it no longer appears anywhere in src/ or index.html (a moved
// text is fine). A test line that asserts the text is absent («not in», doesNotMatch…) is listed but does not fail.
//   node scripts/stale-text-check.mjs --base SHA_BASE      compares the working tree (committed or not) with SHA_BASE
// Exit 1 when a test still expects a gone text, 0 otherwise.
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync,statSync} from 'node:fs';
import {join,relative} from 'node:path';
const ROOT=new URL('..',import.meta.url).pathname;
const args=process.argv.slice(2),at=args.indexOf('--base'),base=at>=0?args[at+1]:null;
if(!base){console.error('Use: node scripts/stale-text-check.mjs --base SHA_BASE');process.exit(2);}
const git=(...a)=>execFileSync('git',a,{cwd:ROOT,encoding:'utf8',maxBuffer:64<<20});
let diff;try{diff=git('diff','-U0','--no-color',base,'--','src','index.html');}catch(e){console.error(`Cannot compare with ${base}: ${String(e.stderr||e.message).trim()}`);process.exit(2);}
const removed=[];let file='';
for(const line of diff.split('\n')){
 if(line.startsWith('+++ '))file=line.slice(4).replace(/^b\//,'');
 else if(line.startsWith('-')&&!line.startsWith('---'))removed.push({file,text:line.slice(1)});
}
const LETTER=/\p{L}/u,SPANISH=/[áéíóúñÁÉÍÓÚÑ¿¡«»·…]/u,CODE=/[{};=<>]|=>|\w\(|^\s*[#.@][\w-]+$|^[\w.-]+\/[\w./-]*$|\b(const|function|return|var|let)\b/;
// A text a player reads: words with a space, a capitalised label, or Spanish punctuation, and no code.
function playerText(s){
 s=s.trim();if(s.length<4||!LETTER.test(s)||CODE.test(s))return false;
 return SPANISH.test(s)||/\s/.test(s)&&/\p{L}{3}/u.test(s)||/^[A-ZÁÉÍÓÚÑ]\p{Ll}{3,}[.!?]?$/u.test(s);
}
function segments(raw){
 // String literals, then their text between tags and template expressions.
 const out=[];
 for(const m of raw.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`|>([^<>]+)</g)){
  const body=(m[1]??m[2]??m[3]??m[4]??'').replace(/\\(['"`\\])/g,'$1').replace(/\\n/g,' ');
  // The whole text and each of its sentences: tests often expect one sentence of a longer notice.
  for(const part of body.split(/\$\{[^}]*\}|<[^>]*>|&[a-z]+;/))for(const piece of new Set([part,...part.split(/(?<=[.!?…])\s+|\s+·\s+/)]))if(playerText(piece))out.push(piece.trim());
 }
 return out;
}
function files(dir,test){
 const out=[];
 for(const name of readdirSync(dir)){const path=join(dir,name),st=statSync(path);
  if(st.isDirectory()){if(name!=='node_modules'&&!name.startsWith('.'))out.push(...files(path,test));}else if(test(name))out.push(path);}
 return out;
}
// The translation table keeps Spanish keys after the game stops showing them: it does not keep a text alive.
const current=[...files(join(ROOT,'src'),n=>/\.(js|mjs|json|html|css)$/.test(n)&&!/^i18n-/.test(n)),join(ROOT,'index.html')].map(p=>readFileSync(p,'utf8')).join('\n');
const gone=new Map();
for(const r of removed)for(const s of segments(r.text))if(!current.includes(s)&&!gone.has(s))gone.set(s,r.file);
const tests=files(join(ROOT,'tests'),n=>/\.(py|mjs|js)$/.test(n)).map(p=>({path:relative(ROOT,p),lines:readFileSync(p,'utf8').split('\n')}));
// Absence is read next to the text itself: «'X' not in page», «assert not …'X'», «doesNotMatch(…/X/)», «!….includes('X')».
const BEFORE=/(\bassert not\b|doesNotMatch|notEqual|notStrictEqual|!\s*[\w.$()[\]]*\.includes\(|\.not\.|\bnot any\(|\bnot\s+[\w.$]*\()[^;]{0,40}$/,AFTER=/^.{0,3}\s*(not in\b|\)\s*===?\s*-1|\)\s*is None)/;
const negatedAt=(line,text)=>{let i=line.indexOf(text);while(i>=0){if(!BEFORE.test(line.slice(Math.max(0,i-60),i))&&!AFTER.test(line.slice(i+text.length)))return false;i=line.indexOf(text,i+1);}return true;};
let stale=0,absent=0;
for(const [text,from] of gone){
 for(const t of tests)t.lines.forEach((line,i)=>{if(!line.includes(text))return;
  const negated=negatedAt(line,text);negated?absent++:stale++;
  console.log(`${negated?'absent ':'STALE  '} «${text}» (gone from ${from}) · ${t.path}:${i+1}`);
 });
}
console.log(`${gone.size} player text${gone.size===1?'':'s'} gone since ${base.slice(0,12)}; ${stale} test line${stale===1?'':'s'} still expect${stale===1?'s':''} one${absent?`, ${absent} assert${absent===1?'s':''} it is absent`:''}.`);
process.exit(stale?1:0);
