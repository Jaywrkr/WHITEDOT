"""El Escáner (coherencia T1, alpha.259; Escáner NMS, alpha.263) · phone (390x844) and desktop (1280x800). A finger held
500 ms (and the key E) scans: a ring of light leaves the cube and what it reaches becomes a mark on the canvas, with no
panel. Level 1 (the Journey not done): a short wave and icons only, no names or distances. Level 2 (after the Journey):
the mark says «Nombre · 80 m» (found ones dim). While the finger is held the power and surprise HUDs step aside. Scanning silences nothing (bug 8): a lost probe keeps
beeping and an eclipse keeps the screen dark. Reduced motion: the ring does not travel (it is already at its reach) and
nothing pings. Light quality: no halo and no more canvas calls. The cost: no gradient built per frame, no shadowBlur,
sprite caches that settle and at most a few dozen canvas calls more than the same frame without scanning."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time,re
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('ESCANER_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
COUNT="""(()=>{const P=CanvasRenderingContext2D.prototype,C=window.__cc={};window.__frames=0;
 for(const m of ['fillRect','stroke','fill','drawImage','fillText','strokeRect','createRadialGradient','createLinearGradient']){const o=P[m];P[m]=function(...a){if(this.canvas&&this.canvas.id==='w')C[m]=(C[m]||0)+1;return o.apply(this,a);};}
 const d=Object.getOwnPropertyDescriptor(P,'shadowBlur');Object.defineProperty(P,'shadowBlur',{configurable:true,get(){return d.get.call(this);},set(v){if(v>0&&this.canvas&&this.canvas.id==='w')C.shadow=(C.shadow||0)+1;d.set.call(this,v);}});
 const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(t=>{try{cb(t);}finally{window.__frames++;}});})();"""
PER_FRAME="""async(ms)=>{const K=await import('/src/fx-kit.js'),m0=K.fxSpritesMade();for(const k in __cc)delete __cc[k];const f0=__frames;await new Promise(r=>setTimeout(r,ms));
 const n=Math.max(1,__frames-f0),o={frames:n,made:K.fxSpritesMade()-m0};for(const k in __cc)o[k]=__cc[k]/n;return o;}"""
calls=lambda o:sum(o.get(k,0) for k in ['fillRect','stroke','fill','drawImage','fillText','strokeRect'])
grads=lambda o:o.get('createRadialGradient',0)+o.get('createLinearGradient',0)
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.liveEncounterRest?.();r.save();}"
# A test thing 80 m east of where the cube stands (found or not), registered in the game's own registry.
PROBE_ENTRY="""async()=>{const M=await import('/src/scanner-model.js');if(!M.scanEntry('prueba'))M.registerScan({id:'prueba',name:'Faro de prueba',shape:'sonda',level:1,rarity:3,
 sites:p=>window.__prueba?[{key:'a',x:window.__prueba.x,y:window.__prueba.y}]:[],done:()=>!!window.__pruebaDone});return true;}"""
GO="(p)=>{const r=__r;r.S.wx=p.x;r.S.wy=p.y;if(r.body){r.body.x=r.body.px=p.x;r.body.y=r.body.py=p.y;}window.__prueba={x:p.x+800,y:p.y};}"
def hold(page,ms=650):
 """A still finger on an empty spot (off the cube) for ms, released after the check."""
 w,h=page.viewport_size['width'],page.viewport_size['height'];page.mouse.move(w/2+70,h/2-90);page.mouse.down();page.wait_for_timeout(ms)
def st(page):return page.evaluate("__r.scanState()")
def marks(page):return page.evaluate("__r.scanState().marks")
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script(COUNT)
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.scanState&&__r.ringState?.().active&&!!__r.skySecretState",timeout=90000)
   # Alpha.264: each trophy upgrades the radar; as a new player after the Llanura (one trophy), level 2 at 120 m.
   page.evaluate("()=>{__r.S.journey.done={llanura:true};const d=__r.placesData();for(const id of Object.keys(d.stars))if(id!=='llanura')d.stars[id]=[false,false,false];}")
   page.evaluate(FREE);page.wait_for_timeout(600);page.evaluate(FREE);page.evaluate(PROBE_ENTRY)
   M=page.evaluate("async()=>{const M=await import('/src/secretos-cielo-model.js');return {probes:M.PROBES.map(p=>({i:p.i,x:p.x,y:p.y})),site:M.eclipseNear({x:__r.S.wx,y:__r.S.wy},2e6),cutoff:M.ECLIPSE_CUTOFF};}")
   home=page.evaluate("({x:__r.S.wx,y:__r.S.wy})");page.evaluate(GO,home)
   # --- 1 · Level 1: the Journey not done. A short wave and shapes, no names.
   was=page.evaluate("()=>{const j=__r.S.journey;const o={free:j.free,finished:j.finished};j.free=false;j.finished=false;return o;}")
   page.evaluate("()=>{window.__prueba={x:__r.S.wx+250,y:__r.S.wy};return true;}")   # 25 m: inside the short wave
   # A busy runner can stretch the game's hold timer past 650 ms of wall clock: keep holding until it scans (≤3 s).
   hold(page,650);page.wait_for_function("__r.scanning",timeout=3000);assert page.evaluate("__r.scanning") and not page.locator('#scanner').is_visible(),'a held finger scans, no panel'
   s=st(page);assert s['scanning'] and s['level']=='1' and not s['names'] and s['reach']==400,s
   page.wait_for_function("__r.scanState().drawn.ring&&__r.scanState().drawn.radius>20",timeout=3000)
   assert any(i['id']=='prueba' for i in s['items']),s['items'];assert all(i['name'] is None for i in s['items']),'level 1 says no names'
   page.wait_for_function("__r.scanState().marks.some(m=>m.id==='prueba')",timeout=3000)
   assert all(m['label'] is None for m in marks(page)),('level 1: icons only',marks(page))
   page.wait_for_timeout(700);assert st(page)['drawn']['labels']==0,'no names on the canvas at level 1'
   if SHOTS:page.screenshot(path=f'{SHOTS}/nivel1-{width}.png')
   page.mouse.up();assert not page.evaluate("__r.scanning") and not page.locator('#scanner').is_visible(),'released'
   page.evaluate("()=>{__r.stopScanner();}");page.wait_for_function("__r.scanState().marks.length===0",timeout=12000)
   page.evaluate("(o)=>{const j=__r.S.journey;j.free=o.free;if(o.finished===undefined||o.finished===null)delete j.finished;else j.finished=o.finished;}",was)
   # --- 2 · Level 2: names and distances on the marks, found ones dim; no panel.
   page.evaluate(GO,home);page.wait_for_timeout(300);hold(page,1600)
   s=st(page);assert s['level']=='2' and s['names'] and s['reach']==1200,s
   mk=marks(page);first=[m for m in mk if m['id']=='prueba'];assert first and first[0]['label']=='Faro de prueba · 80 m' and first[0]['edge'],mk
   for m in mk:assert m['label'] and re.fullmatch(r'.+ · (\d+ m|\d+,\d km)',m['label']),m
   assert not page.locator('#scanner').is_visible()
   page.wait_for_function("__r.scanState().drawn.labels>=1",timeout=4000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/nivel2-{width}.png')
   page.evaluate("window.__pruebaDone=true;__r.updateScanner(true)");page.wait_for_timeout(100)
   assert [m for m in marks(page) if m['id']=='prueba'][0]['done'],'found: dim';page.evaluate("window.__pruebaDone=false")
   # The HUDs of a power and of a surprise step aside while the finger is held.
   page.evaluate("document.getElementById('surpriseHud').hidden=false;document.getElementById('sparkPowerHud').hidden=false")
   assert page.evaluate("getComputedStyle(document.getElementById('surpriseHud')).visibility")=='hidden'
   assert page.evaluate("getComputedStyle(document.getElementById('sparkPowerHud')).visibility")=='hidden'
   page.mouse.up();page.evaluate("document.getElementById('surpriseHud').hidden=true;document.getElementById('sparkPowerHud').hidden=true")
   # The key E, and the quiet view (no words on the World's canvas) still names what was asked for.
   page.evaluate("__r.setJourneyMode('viaje')");page.wait_for_timeout(200)
   page.keyboard.down('e');page.wait_for_function("__r.scanState().drawn.labels>=1",timeout=4000);assert page.evaluate("__r.scanning")
   page.keyboard.up('e');assert not page.evaluate("__r.scanning")
   page.evaluate("__r.setJourneyMode('libre')")
   # --- 3 · The cost per frame: scanning adds a few calls, no gradient, no shadow; the sprites settle.
   page.evaluate(GO,home);page.evaluate(HIDE);page.wait_for_function("__r.scanState().marks.length===0",timeout=12000);page.wait_for_timeout(300);page.evaluate(PER_FRAME,400)
   idle=page.evaluate(PER_FRAME,1000)
   page.evaluate("__r.startScanner()");page.evaluate(PER_FRAME,300)
   held=page.evaluate(PER_FRAME,1200);page.evaluate("__r.stopScanner()")
   print(f'{width}x{height} idle',{k:round(v,1) for k,v in idle.items()},'scanning',{k:round(v,1) for k,v in held.items()},flush=True)
   assert held['frames']>=6 and grads(held)<=grads(idle)+.5 and held.get('shadow',0)==0 and held['made']<=2,held
   assert calls(held)<=calls(idle)+80,('scanning adds a few canvas calls',idle,held)
   # Light quality: no halo, no trailing ring, no ping; never more than the full quality.
   page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'ligera'}});}");page.wait_for_timeout(400);page.evaluate(HIDE)
   page.evaluate("__r.startScanner()");page.wait_for_timeout(150);light2=page.evaluate(PER_FRAME,600);page.evaluate("__r.stopScanner()")
   page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'alta'}});}");page.wait_for_timeout(300);page.evaluate(HIDE)
   page.evaluate("__r.startScanner()");page.wait_for_timeout(150);full=page.evaluate(PER_FRAME,600);page.evaluate("__r.stopScanner()")
   print(f'{width}x{height} light',{k:round(v,1) for k,v in light2.items()},'full',{k:round(v,1) for k,v in full.items()},flush=True)
   assert grads(light2)<=.5 and light2.get('shadow',0)==0,light2
   assert light2.get('stroke',0)<=full.get('stroke',0) and light2.get('strokeRect',0)<=full.get('strokeRect',0)+.5,('light quality strokes no more',light2,full)
   # --- 4 · Reduced motion: the ring is already at its reach and fades; nothing travels or pings.
   page.evaluate("()=>{__r.S.reducedMotion=true;}");page.evaluate("__r.startScanner()");page.wait_for_timeout(120)
   s=st(page);assert s['still'] and s['drawn']['ring'] and s['drawn']['radius']>=min(1200,((width**2+height**2)**.5)/2),s
   page.wait_for_timeout(900);s=st(page);assert not s['drawn']['ring'] and s['drawn']['icons']>=1,('the ring fades in place, the icons stay',s)
   page.evaluate("__r.stopScanner()");page.evaluate("()=>{__r.S.reducedMotion=false;}")
   # --- 5 · Bug 8: scanning silences nothing. A probe 80 m away keeps beeping while the finger is held.
   p=M['probes'][1];page.evaluate("()=>{__r.S.sound=true;__r.audio?.();__r.ac?.resume?.();}")
   page.wait_for_function("__r.ac?.state==='running'&&!!__r.comfortLowpass",timeout=15000)
   page.evaluate(GO,{'x':p['x']+800,'y':p['y']});page.evaluate("window.__prueba=null");page.wait_for_function("__r.skySecretState().beeps>=1",timeout=20000)
   page.evaluate("__r.startScanner()");b0=page.evaluate("__r.skySecretState().beeps")
   page.wait_for_function(f"__r.skySecretState().beeps>={b0+2}",timeout=20000);assert page.evaluate("__r.scanning"),'still scanning'
   page.wait_for_function("__r.scanState().marks.some(m=>m.label==='Sonda · 80 m')",timeout=4000)
   page.evaluate("__r.stopScanner()")
   # And an eclipse keeps the screen and the music dark while you scan.
   site=M['site'];page.evaluate(GO,{'x':site['x']+200,'y':site['y']});page.wait_for_function(f"__r.skySecretState().drawn.eclipse?.id==='{site['id']}'",timeout=8000)
   wait=page.evaluate(f"async()=>{{const M=await import('/src/secretos-cielo-model.js');return M.eclipseWait(M.eclipseNear({{x:{site['x']},y:{site['y']}}},10),__r.skySecretState().now);}}")
   page.evaluate(f"__r.skySecretSkip({wait+.6})");page.wait_for_function("!!__r.skySecretState().eclipse&&__r.skySecretState().dark",timeout=8000)
   page.evaluate("__r.startScanner()");page.wait_for_timeout(500)
   e=page.evaluate("({dark:__r.skySecretState().dark,eclipse:!!__r.skySecretState().eclipse,scanning:__r.scanning})");assert e['scanning'] and e['dark'] and e['eclipse'],('the eclipse stays while scanning',e)
   page.evaluate("__r.stopScanner()");page.evaluate("()=>{__r.S.sound=false;}")
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started
 print(f'PASS escáner on phone and desktop in {elapsed:.0f} s: a held finger and the key E scan with no panel; level 1 is a short wave with icons and no names; level 2 marks name and measure («Faro de prueba · 80 m»), found ones dim, names on the canvas even in the quiet view; the power and surprise HUDs step aside; no gradient or shadow per frame and a few canvas calls more; light quality and reduced motion (the ring does not travel); a probe keeps beeping and an eclipse stays dark while scanning',flush=True)
finally:server.shutdown()
