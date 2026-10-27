// Kubono for the desktop (itch.io and Steam). Electron opens the sale-edition build from scripts/itch-package.mjs, copied
// next to this file as game/, through its own app:// scheme so ES modules and localStorage work as on the web.
// No network, no Electron menus, no DevTools in the packaged app; the game is saved in the user's profile under the app ID.
'use strict';
const {app,BrowserWindow,Menu,protocol,session}=require('electron');
const path=require('node:path');
const fs=require('node:fs/promises');
const {APP_ID,SCHEME,HOST,START_URL,contentType,resolveGameFile,isAllowedRequest}=require('./serve.cjs');

const GAME=path.join(__dirname,'game');
// The save lives in <appData>/com.playkubono.kubono whatever the product name or version: updates keep the game.
app.setName('Kubono');
app.setPath('userData',path.join(app.getPath('appData'),APP_ID));
if(process.platform==='win32')app.setAppUserModelId(APP_ID);
// Chromium would fetch spell-check dictionaries from Google as the session starts (tests/desktop_smoke.py saw it):
// no languages, no download. The game has no text to check.
app.on('session-created',ses=>{try{ses.setSpellCheckerEnabled(false);ses.setSpellCheckerLanguages([]);}catch(_){}});
protocol.registerSchemesAsPrivileged([{scheme:SCHEME,privileges:{standard:true,secure:true,supportFetchAPI:true,stream:true}}]);

// One game at a time: two windows would write the same save.
if(!app.requestSingleInstanceLock())app.quit();
else{
 let win=null;
 const blocked=url=>console.log('[kubono] blocked '+String(url).slice(0,200));
 app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus();}});

 async function serve(request){
  const file=resolveGameFile(GAME,request.url);
  if(!file)return new Response('Not found',{status:404});
  try{return new Response(await fs.readFile(file),{headers:{'content-type':contentType(file),'cache-control':'no-cache'}});}
  catch(_){return new Response('Not found',{status:404});}
 }

 function createWindow(){
  win=new BrowserWindow({width:1280,height:800,minWidth:360,minHeight:560,useContentSize:true,show:false,title:'Kubono',backgroundColor:'#000000',
   autoHideMenuBar:true,icon:path.join(GAME,'icons','icon-512.png'),
   webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,devTools:!app.isPackaged,spellcheck:false,enableWebSQL:false}});
  const contents=win.webContents;
  // F11 (and Alt+Enter, the usual PC game key) toggle fullscreen. Escape stays with the game.
  contents.on('before-input-event',(event,input)=>{
   if(input.type!=='keyDown')return;
   if(input.key==='F11'||(input.key==='Enter'&&input.alt)){event.preventDefault();win.setFullScreen(!win.isFullScreen());}
  });
  contents.setWindowOpenHandler(({url})=>{blocked(url);return {action:'deny'};});
  contents.on('will-navigate',(event,url)=>{if(!url.startsWith(`${SCHEME}://${HOST}/`)){event.preventDefault();blocked(url);}});
  contents.on('will-attach-webview',event=>event.preventDefault());
  win.once('ready-to-show',()=>win.show());
  win.on('enter-full-screen',()=>console.log('[kubono] fullscreen on'));win.on('leave-full-screen',()=>console.log('[kubono] fullscreen off'));
  win.on('closed',()=>{win=null;});
  win.loadURL(START_URL);
 }

 app.whenReady().then(()=>{
  const ses=session.defaultSession;
  ses.protocol.handle(SCHEME,serve);
  // Nothing leaves the computer: every request that is not the game's own file is cancelled.
  ses.webRequest.onBeforeRequest((details,callback)=>{if(isAllowedRequest(details.url))callback({});else{blocked(details.url);callback({cancel:true});}});
  // Only what the game uses: copying a code to the clipboard. No camera, microphone, location or notifications.
  ses.setPermissionRequestHandler((_,permission,callback)=>callback(permission==='clipboard-sanitized-write'||permission==='fullscreen'));
  // macOS keeps a minimal menu (Quit, Hide, Copy/Paste, Window); Windows and Linux have none.
  Menu.setApplicationMenu(process.platform==='darwin'?Menu.buildFromTemplate([{role:'appMenu'},{role:'editMenu'},{role:'windowMenu'}]):null);
  createWindow();
  app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)createWindow();});
 });

 // A single-window game: closing it quits, on every system. The save is flushed to disk before leaving.
 app.on('window-all-closed',()=>app.quit());
 app.on('before-quit',()=>{try{session.defaultSession.flushStorageData();}catch(_){}});
}
