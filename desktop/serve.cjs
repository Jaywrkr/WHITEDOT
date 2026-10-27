// Pure helpers for the desktop wrapper (no Electron here, so Node tests can load them).
'use strict';
const path=require('node:path');

const APP_ID='com.playkubono.kubono'; // Confirmed by Jay; changing it moves the save folder (docs/ITCH.md).
const SCHEME='app',HOST='kubono',START_URL=`${SCHEME}://${HOST}/index.html`;
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
 '.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg',
 '.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.otf':'font/otf','.mp3':'audio/mpeg',
 '.ogg':'audio/ogg','.wav':'audio/wav','.m4a':'audio/mp4','.txt':'text/plain; charset=utf-8','.wasm':'application/wasm'};
const contentType=file=>TYPES[path.extname(file).toLowerCase()]||'application/octet-stream';

// app://kubono/<path> → a file inside the game folder, or null. Nothing outside the folder, no other host.
function resolveGameFile(gameRoot,url){
 let parsed;try{parsed=new URL(url);}catch(_){return null;}
 if(parsed.protocol!==SCHEME+':'||parsed.host!==HOST)return null;
 let rel;try{rel=decodeURIComponent(parsed.pathname);}catch(_){return null;}
 if(rel.includes('\0'))return null;
 if(rel===''||rel.endsWith('/'))rel+='index.html';
 const root=path.resolve(gameRoot),file=path.resolve(root,'.'+path.posix.normalize('/'+rel));
 return file===root||!file.startsWith(root+path.sep)?null:file;
}

// The game never needs the network. Only its own scheme and in-page data are allowed.
const isAllowedRequest=url=>/^(app:\/\/kubono\/|data:|blob:)/.test(String(url));

module.exports={APP_ID,SCHEME,HOST,START_URL,contentType,resolveGameFile,isAllowedRequest};
