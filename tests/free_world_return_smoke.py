"""Panel 11 (Q6). D7-C: a new player starts on the Camino; a save left mid-Journey in the Bosque with yesterday's
todayKey loads in the Bosque, where it was, with the day's Camino back as a walk. D11-B: in the open Universe the
pulse sounds when the finger goes down (40 blank taps 20 ms after the heard beat: pointerdown to the theme's note
median within 15 ms, 95 % within 30 ms on shared runners; output latency apart), a still finger opens the scanner at
500 ms with that one pulse only, and a drag walks. A model of the browser's timing, not a phone."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
 def do_GET(self):
  if self.path.split('?')[0]=='/src/main.js':
   s=(ROOT/'src/main.js').read_text()+'''\nwindow.__r=runtime;window.__notes=[];window.__inputs=[];'''
   self.send_response(200);self.send_header('Content-Type','text/javascript');self.end_headers();self.wfile.write(s.encode());return
  if self.path.split('?')[0]=='/src/interactions.js':
   src=(ROOT/'src/interactions.js').read_text()
   old="runtime.playTheme(hit.midi,hit.degree,t,region,hit.scale,hit.tr);"
   assert old in src
   s=src.replace(old,"window.__notes?.push({at:performance.now(),t,now:runtime.ac.currentTime});"+old).replace("function sonar(origin='player',atMs=null){","function sonar(origin='player',atMs=null){if(origin==='player')window.__inputs?.push({at:performance.now(),touch:atMs});")
   assert s!=src
   self.send_response(200);self.send_header('Content-Type','text/javascript');self.end_headers();self.wfile.write(s.encode());return
  super().do_GET()
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
TAPS='''async()=>{const r=__r,cv=document.getElementById('w'),sleep=ms=>new Promise(f=>setTimeout(f,ms)),out=[];
 for(let n=0;n<40;n++){
  const ac=r.ac,lat=Math.min(.4,ac.outputLatency||ac.baseLatency||0),heard=ac.currentTime-lat;let b=null;for(const x of r.MU.bq)if(x>heard+.15&&(b===null||x<b))b=x;
  if(b===null){const q=r.MU.bq.at(-1),bar=r.SIX*4;b=q;while(b<heard+.15)b+=bar;}
  await sleep(Math.max(0,(b-heard)*1000+20));
  const notes=__notes.length,inputs=__inputs.length,o={bubbles:true,pointerId:40+n,isPrimary:true,clientX:innerWidth*(n%2?.2:.8),clientY:innerHeight*.3,pointerType:'touch'};
  const down=performance.now();cv.dispatchEvent(new PointerEvent('pointerdown',o));const before=__inputs.length>inputs;
  await sleep(120);window.dispatchEvent(new PointerEvent('pointerup',o));
  const note=__notes[notes];out.push({before,count:__inputs.length-inputs,lag:note?(note.at-down)+Math.max(0,note.t-note.now)*1000:null,input:__inputs[inputs]?__inputs[inputs].at-down:null});
  await sleep(380);}
 return {out,latency:r.ac.outputLatency||0};}'''
HOLD='''async()=>{const r=__r,cv=document.getElementById('w'),sleep=ms=>new Promise(f=>setTimeout(f,ms));await sleep(400);
 const o={bubbles:true,pointerId:7,isPrimary:true,clientX:innerWidth*.75,clientY:innerHeight*.35,pointerType:'touch'},inputs=__inputs.length;
 cv.dispatchEvent(new PointerEvent('pointerdown',o));const down=__inputs.length-inputs;await sleep(380);const early=!!r.scanning;await sleep(260);const open=!!r.scanning;
 window.dispatchEvent(new PointerEvent('pointerup',o));await sleep(50);return {down,early,open,after:!!r.scanning,total:__inputs.length-inputs};}'''
DRAG='''async()=>{const r=__r,cv=document.getElementById('w'),sleep=ms=>new Promise(f=>setTimeout(f,ms));await sleep(400);
 const x0=r.S.wx,y0=r.S.wy,o={bubbles:true,pointerId:8,isPrimary:true,clientX:innerWidth*.5,clientY:innerHeight*.6,pointerType:'touch'},inputs=__inputs.length;
 cv.dispatchEvent(new PointerEvent('pointerdown',o));for(let i=1;i<=8;i++){await sleep(30);window.dispatchEvent(new PointerEvent('pointermove',{...o,clientX:o.clientX+i*8}));}
 await sleep(700);const moved=Math.hypot(r.S.wx-x0,r.S.wy-y0),scanning=!!r.scanning;window.dispatchEvent(new PointerEvent('pointerup',{...o,clientX:o.clientX+64}));await sleep(50);
 return {moved,scanning,pulses:__inputs.length-inputs};}'''
YESTERDAY="(()=>{const d=new Date();d.setDate(d.getDate()+(__r.S.offset||0)-1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');})()"
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  # A real player's browser: new saves start in the Journey, on the Camino.
  p.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
  url=f'http://127.0.0.1:{srv.server_port}/'
  p.goto(url);p.wait_for_function('!!window.__r?.journeyMode&&!!__r.worldOpened');p.wait_for_timeout(500)
  assert p.evaluate('[__r.S.mode,__r.worldReady(),__r.worldOpened(),__r.journeyMode()]')==['camino',False,False,'viaje'],'a new player starts on the Camino'
  # A new player on a new day: still the Camino and the ten crystals.
  p.evaluate(f"()=>{{const k=__r.saveStore.key,o=JSON.parse(localStorage.getItem(k));o.todayKey={YESTERDAY};localStorage.setItem(k,JSON.stringify(o));location.reload();}}")
  p.wait_for_function('!!window.__r?.journeyMode&&!!__r.worldOpened');p.wait_for_timeout(500)
  assert p.evaluate('[__r.S.mode,__r.worldReady(),__r.S.todayKey===__r.dayKey()]')==['camino',False,True],'a new player on a new day still needs ten crystals'
  # Into the World and on through the Journey to the Bosque (chapter 3).
  p.evaluate("()=>{const r=__r;document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);r.S.pathCrystals=Array.from({length:10},(_,i)=>'t:'+i);r.enterWorld({automatic:true});const j=r.S.journey;j.chapter=2;j.done={...j.done,llanura:true,lago:true};r.journeyTravel();r.save();}")
  p.wait_for_function("__r.BIOMES[Math.max(0,__r.curZone)]?.id==='bosque'",timeout=10000)
  at=p.evaluate('[__r.S.wx,__r.S.wy,__r.S.journey.chapter,__r.S.sparks]')
  # Leave it there overnight: yesterday's todayKey and World day, in one synchronous step so nothing saves in between.
  p.evaluate(f"()=>{{const r=__r;r.save();const k=r.saveStore.key,o=JSON.parse(localStorage.getItem(k)),y={YESTERDAY};o.todayKey=y;o.lastWorldDay=y;localStorage.setItem(k,JSON.stringify(o));location.reload();}}")
  p.wait_for_function('!!window.__r?.journeyMode&&!!__r.worldOpened');p.wait_for_timeout(1200)
  back=p.evaluate("({mode:__r.S.mode,x:__r.S.wx,y:__r.S.wy,chapter:__r.S.journey.chapter,biome:__r.BIOMES[Math.max(0,__r.curZone)]?.id,today:__r.S.todayKey===__r.dayKey(),path:__r.S.pathCrystals.length,ready:__r.worldReady(),journey:__r.journeyMode()})")
  assert back['mode']=='world' and back['biome']=='bosque' and [back['x'],back['y'],back['chapter']]==at[:3],('a save in the Bosque with yesterday\'s todayKey loads in the Bosque',back,at)
  assert back['today'] and back['path']==0 and back['ready'] and back['journey']=='viaje',('the day\'s Camino is back as a walk, the World stays open',back)
  # The Camino as a walk: «Volver al Camino», then «Entrar al Mundo» brings the player back without ten crystals.
  p.evaluate("()=>{__r.exitWorld(false);__r.hud();}");assert p.evaluate('__r.S.mode')=='camino'
  assert p.evaluate("!document.getElementById('bPrimary').hidden&&document.getElementById('bPrimaryL').textContent==='Entrar al Mundo'"),'the World waits one tap away'
  p.evaluate('__r.enterWorld()');assert p.evaluate('__r.S.mode')=='world','the World opens without the ten crystals'
  # D11-B: the open Universe (the Journey finished, free view, no round), the real player's touch (not the finger mode).
  p.evaluate("()=>{const r=__r;r.S.journey.finished=true;r.S.journey.free=true;r.setJourneyMode('libre');r.applyJourneyMode?.();r.S.sound=true;r.fingerTouch=false;document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);r.audio();}")
  assert p.evaluate('[__r.inWorld(),__r.journeyQuiet(),!!__r.placeRun?.()]')==[True,False,False],'open Universe'
  p.wait_for_function('__r.ac?.state==="running"&&__r.MU.bq.length>1',timeout=15000);p.wait_for_timeout(1500)
  r=p.evaluate(TAPS);taps=r['out']
  assert all(t['before'] for t in taps),('every pulse before the finger lifts',taps)
  assert all(t['count']==1 for t in taps),('one pulse per tap, not a second on release',taps)
  assert all(t['input'] is not None and t['input']<15 for t in taps),('dispatched within 15 ms of the touch',taps)
  hits=sorted(t['lag'] for t in taps if t['lag'] is not None)
  assert len(hits)>=20,('most taps on the beat hit',taps)
  median=hits[len(hits)//2];p95=hits[max(0,int(len(hits)*.95+.999)-1)]
  assert median<=15,('pointerdown to the note: median within 15 ms',hits)
  assert p95<=30,('pointerdown to the note within 30 ms in 95 % of the hits',hits)
  h=p.evaluate(HOLD)
  assert h['down']==1 and not h['early'] and h['open'] and not h['after'] and h['total']==1,('a still finger: the pulse on down, the scanner at 500 ms, nothing more on release',h)
  d=p.evaluate(DRAG)
  assert d['moved']>5 and not d['scanning'] and d['pulses']==1,('a drag walks after its one pulse',d)
  assert not errors,errors;b.close()
 print('PASS free World return and touch (Q6): new player on the Camino (also on a new day); a mid-Journey save in the Bosque with yesterday\'s todayKey loads in the Bosque with the day\'s Camino as a walk; in the open Universe %d of 40 blank taps on the beat, pointerdown to the note median %.1f ms (≤ 15), p95 %.1f ms (≤ 30), output latency %.0f ms apart; hold opens the scanner with one pulse, drag walks %.0f px'%(len(hits),median,p95,r['latency']*1000,d['moved']),flush=True)
finally:srv.shutdown();srv.server_close()
