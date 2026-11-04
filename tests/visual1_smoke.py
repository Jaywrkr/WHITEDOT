"""Visual 1 (alpha.250): the World's shared light on a phone (390x844) and a desktop (1280x800). It draws without errors
with the kit's pieces on screen (a box, a wonder, a wild spark, a living encounter, a rare sound, crystals, particles
and pulse waves); opening a box pops in gold on the shared layer; with reduced motion nothing new moves (no pop); with
light quality the pool is smaller and a pop has half the sparks. The cost per frame does not go up: the canvas calls of
the World are counted per frame (as the visual audit did) and stay under the counts measured on main before alpha.250
(start of the free World on the phone: 31 radial gradients, about 1 770 fillRect; Cristales: about 1 560 strokes), and
no shadowBlur is drawn."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Canvas calls on the World's canvas (#w) and the time of each animation frame's callback.
COUNT="""(()=>{const P=CanvasRenderingContext2D.prototype,C=window.__cc={};window.__frames=0;window.__ft=[];
 for(const m of ['fillRect','stroke','drawImage','createRadialGradient','fill']){const o=P[m];P[m]=function(...a){if(this.canvas&&this.canvas.id==='w')C[m]=(C[m]||0)+1;return o.apply(this,a);};}
 const d=Object.getOwnPropertyDescriptor(P,'shadowBlur');Object.defineProperty(P,'shadowBlur',{configurable:true,get(){return d.get.call(this);},set(v){if(v>0&&this.canvas&&this.canvas.id==='w')C.shadow=(C.shadow||0)+1;d.set.call(this,v);}});
 const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(t=>{const s=performance.now();try{cb(t);}finally{window.__frames++;window.__ft.push(performance.now()-s);if(window.__ft.length>300)window.__ft.shift();}});})();"""
PER_FRAME="""()=>new Promise(res=>{for(const k in __cc)delete __cc[k];const f0=__frames;__ft.length=0;setTimeout(()=>{const n=Math.max(1,__frames-f0),o={frames:n};for(const k in __cc)o[k]=__cc[k]/n;const s=[...__ft].sort((a,b)=>a-b);o.p50=s[Math.floor(s.length/2)]||0;res(o);},1500);})"""
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.S.firstJourney&&(r.S.firstJourney.skipped=true);r.S.pathCrystals=Array.from({length:10},(_,i)=>'v1:'+i);r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');if(!r.inWorld())r.enterWorld?.({automatic:true});r.stopAutopilot?.();r.save();}"
GO="(p)=>{const r=__r;"+HIDE+";r.S.wx=p.x;r.S.wy=p.y;r.stopAutopilot?.();}"
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   phone=width<500;area=width*height/(390*844)
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script(COUNT)
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.liveEncounterSpawn&&!!__r.fxLayer&&__r.ringState?.().active",timeout=60000)
   page.evaluate(FREE);page.wait_for_timeout(900);page.evaluate(FREE);page.wait_for_timeout(600)
   # 1 · The cost: under the counts of main before alpha.250, and no shadowBlur.
   start=page.evaluate(PER_FRAME);print(f'{width}x{height} start',{k:round(v,1) for k,v in start.items()},flush=True)
   assert start['frames']>=8,start
   assert start.get('createRadialGradient',0)<=12,('gradients per frame',start)
   assert start.get('fillRect',0)<=1400*max(1,area),('fillRect per frame',start)
   assert start.get('shadow',0)==0,('no shadowBlur',start)
   crystal=page.evaluate("""()=>{const r=__r,RP=r.REG*r.WCH;for(let i=-40;i<=40;i++)for(let j=-40;j<=40;j++){const x=i*RP+RP/2,y=j*RP+RP/2;if(r.regionOfPos(x,y).sea)continue;if(r.BIOMES[r.biomeOfPos(x,y)]?.id==='cristales')return {x,y};}return null;}""")
   if crystal:
    page.evaluate(GO,crystal);page.wait_for_timeout(900);lattice=page.evaluate(PER_FRAME);print(f'{width}x{height} cristales',{k:round(v,1) for k,v in lattice.items()},flush=True)
    assert lattice.get('stroke',0)<=600*max(1,area),('the lattice in one path per colour',lattice)
    assert lattice.get('createRadialGradient',0)<=12 and lattice.get('shadow',0)==0,lattice
    page.evaluate(FREE)
   # 2 · Everything the kit touches, on screen at once, draws without errors.
   page.evaluate("()=>{const r=__r,x=r.S.wx,y=r.S.wy;r.S.wild&&(r.S.wild.day='');r.spawnBox(x+70,y-40);r.spawnBox(x+900,y);r.wildSpawn?.();r.liveEncounterSpawn('polilla');r.soundSpawn?.('lago:pez',120,40);for(let i=0;i<3;i++)r.waves.push({x,y,r:i*60,prev:0,max:340,n:0,origin:'player',beat:i===0});r.burst(x,y,40,true);r.burst(x,y,20,false);}")
   page.wait_for_timeout(250);page.evaluate(HIDE)
   assert page.evaluate("__r.parts.length")>0,'particles in runtime.parts, the same array'
   assert page.evaluate("__r.fxLayer.pop(__r.S.wx,__r.S.wy,'#88ccee',{sparks:8})") is True and page.evaluate("__r.fxLayer.count()")>=8
   busy=page.evaluate(PER_FRAME);print(f'{width}x{height} busy',{k:round(v,1) for k,v in busy.items()},flush=True)
   assert busy.get('shadow',0)==0 and busy.get('createRadialGradient',0)<=14,busy
   assert busy['p50']<40,('a frame stays well under budget even here',busy)
   # 3 · Opening a box pops in gold on the shared layer (drawn after the grey sheet).
   page.evaluate("()=>{__r.fxLayer.clear();}")
   box=page.evaluate("()=>{const b=__r.spawnBox(__r.S.wx+200,__r.S.wy);return b&&{x:b.x,y:b.y,id:b.id};}");assert box,box
   page.evaluate(GO,box);page.wait_for_function(f"!!__r.S.boxes['{box['id']}']||!__r.boxesNear(900).some(b=>b.id==='{box['id']}')",timeout=8000)
   assert page.evaluate("__r.fxLayer.pops()")>=1 and page.evaluate("__r.fxLayer.count()")>0,'a gold pop when the box opens'
   # 4 · Reduced motion: no pop, nothing new grows in, and the World still draws.
   page.evaluate("()=>{__r.S.reducedMotion=true;__r.fxLayer.clear();}")
   assert page.evaluate("__r.fxLayer.pop(__r.S.wx,__r.S.wy,'#fff')") is False
   box=page.evaluate("()=>{const b=__r.spawnBox(__r.S.wx-200,__r.S.wy);return b&&{x:b.x,y:b.y,id:b.id};}");page.evaluate(GO,box)
   page.wait_for_function(f"!__r.boxesNear(900).some(b=>b.id==='{box['id']}')",timeout=8000);page.wait_for_timeout(200)
   assert page.evaluate("__r.fxLayer.pops()")==0 and page.evaluate("__r.fxLayer.count()")==0,'no pop with reduced motion'
   still=page.evaluate(PER_FRAME);assert still['frames']>=8 and still.get('shadow',0)==0,still
   page.evaluate("()=>{__r.S.reducedMotion=false;}")
   # 5 · Light quality: a smaller pool, half the sparks in a pop, fewer canvas calls than high.
   page.evaluate("()=>{__r.fxLayer.clear();}");page.wait_for_timeout(700);high=page.evaluate(PER_FRAME)
   page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'ligera'}});}");page.wait_for_timeout(400);page.evaluate(HIDE);assert page.evaluate('__r.lightQuality()')
   light=page.evaluate(PER_FRAME)
   page.evaluate("()=>{__r.fxLayer.clear();__r.fxLayer.pop(__r.S.wx,__r.S.wy,'#fff',{sparks:8});}");assert page.evaluate("__r.fxLayer.count()")==4
   page.evaluate("()=>{for(let i=0;i<300;i++)__r.fxLayer.spark(__r.S.wx,__r.S.wy,0,0,2,'#fff');}");assert page.evaluate("__r.fxLayer.count()")==96
   page.wait_for_timeout(200);print(f'{width}x{height} light',{k:round(v,1) for k,v in light.items()},'high',{k:round(v,1) for k,v in high.items()},flush=True)
   calls=lambda o:o.get('fillRect',0)+o.get('stroke',0)+o.get('drawImage',0)+o.get('fill',0)
   assert calls(light)<calls(high),('light quality draws less',light,high)
   page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'alta'}});}")
   assert not errors,errors
   page.close()
  browser.close()
 print(f'PASS visual 1: the shared light draws on phone and desktop without errors (box, wonder, wild spark, living encounter, rare sound, crystals, particles, waves), a box pops in gold, reduced motion pops nothing, light quality halves the sparks and draws less, and the canvas calls per frame stay under main before alpha.250 with no shadowBlur ({time.time()-started:.0f} s)',flush=True)
finally:server.shutdown()
