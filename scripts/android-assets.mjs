// Android owns installation/update/offline storage; the game source remains unchanged.
import {cpSync,readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {stampDeployment} from './stamp-deploy.mjs';
const root=resolve(fileURLToPath(new URL('..',import.meta.url))),out=join(root,'android/app/build/generated/gameAssets/game'),res=join(root,'android/app/build/generated/gameRes/mipmap-xxxhdpi');
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});mkdirSync(res,{recursive:true});
for(const path of ['src','styles','assets','icons','index.html','manifest.webmanifest','package.json','sw.js'])cpSync(join(root,path),join(out,path),{recursive:true});
if(process.env.ANDROID_BUILD_SHA&&process.env.ANDROID_BUILD_TIME)stampDeployment({directory:out,revision:process.env.ANDROID_BUILD_SHA,deployedAt:process.env.ANDROID_BUILD_TIME});
const html=readFileSync(join(out,'index.html'),'utf8').replace('<head>','<head>\n<script src="./android-host.js"></script>');
writeFileSync(join(out,'index.html'),html);cpSync(join(root,'android/host.js'),join(out,'android-host.js'));
// No web worker can retain an older installed APK's shell. Local assets already work offline.
rmSync(join(out,'sw.js'));
cpSync(join(root,'icons/icon-192.png'),join(res,'ic_launcher.png'));
console.log('Android assets staged; game modules preserved, offline APK shell and existing icon.');
