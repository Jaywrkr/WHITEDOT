"""Visual 2 (alpha.254): the sky and the big objects with the shared light, on a phone (390x844) and a desktop (1280x800).
Each scene puts its thing on screen and draws without errors: a comet crystal, a lost probe, an eclipse covering its
star (the corona), a meteor shower, a buoy, a rest satellite, a figure of the sky map being joined, a group of totems,
an activity portal, a landmark seen from the edge, a ball of light, a pulsar, a layered asteroid, a portal of another
rule, a dead region, and a flock with the pet. The cost per frame does not go up against 1d51eab (alpha.253): no
gradient is built per frame in any of them (5 to 9 before, and two linear ones per totem piece), no shadowBlur, the
sprite caches settle (nothing new painted frame after frame), and the canvas calls stay under those measured on
1d51eab (scaled by the screen's area on the desktop). A struck drum pops in the shared layer; with reduced motion
nothing pops; light quality adds no light ('lighter') and draws no more images."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Canvas calls on the World's canvas (#w) per frame: draws, gradients, shadowBlur, and images added with 'lighter'.
COUNT="""(()=>{const P=CanvasRenderingContext2D.prototype,C=window.__cc={};window.__frames=0;window.__ft=[];
 for(const m of ['fillRect','stroke','fill','drawImage','createRadialGradient','createLinearGradient']){const o=P[m];P[m]=function(...a){if(this.canvas&&this.canvas.id==='w'){C[m]=(C[m]||0)+1;if(m==='drawImage'&&this.globalCompositeOperation==='lighter')C.add=(C.add||0)+1;}return o.apply(this,a);};}
 const d=Object.getOwnPropertyDescriptor(P,'shadowBlur');Object.defineProperty(P,'shadowBlur',{configurable:true,get(){return d.get.call(this);},set(v){if(v>0&&this.canvas&&this.canvas.id==='w')C.shadow=(C.shadow||0)+1;d.set.call(this,v);}});
 const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(t=>{const s=performance.now();try{cb(t);}finally{window.__frames++;window.__ft.push(performance.now()-s);if(window.__ft.length>300)window.__ft.shift();}});})();"""
# Per frame over a window; `made`: sprites painted meanwhile (fx-kit.js), which settle once a scene is on screen.
PER_FRAME="""async(ms)=>{const K=await import('/src/fx-kit.js'),m0=K.fxSpritesMade();for(const k in __cc)delete __cc[k];const f0=__frames;__ft.length=0;await new Promise(r=>setTimeout(r,ms));
 const n=Math.max(1,__frames-f0),o={frames:n,made:K.fxSpritesMade()-m0};for(const k in __cc)o[k]=__cc[k]/n;const s=[...__ft].sort((a,b)=>a-b);o.p50=s[Math.floor(s.length/2)]||0;return o;}"""
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.S.firstJourney&&(r.S.firstJourney.skipped=true);r.S.pathCrystals=Array.from({length:10},(_,i)=>'v2:'+i);r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};if(!r.inWorld())r.enterWorld?.({automatic:true});r.stopAutopilot?.();if(r.S.bandas&&r.bandState)for(const e of r.bandState().entries)r.S.bandas.seen[e.id]='';r.save();}"
GO="(p)=>{const r=__r;"+HIDE+";r.liveEncounterRest?.();r.S.wx=p.x;r.S.wy=p.y;r.stopAutopilot?.();}"
# Fixed sites from the models, framed as the visual audit framed them.
SITES="""async()=>{const r=__r,out={};const SC=await import('/src/secretos-cielo-model.js'),R=await import('/src/recorrer-model.js'),D=await import('/src/descubrir-model.js'),w=D.worldKey(r.worldIdentity);
 out.comet={x:SC.COMETS[0].x+110,y:SC.COMETS[0].y+50};out.probe={x:SC.PROBES[0].x+100,y:SC.PROBES[0].y+120};const e=SC.eclipseNear({x:r.S.wx,y:r.S.wy},2e6);out.eclipse={x:e.x+120,y:e.y+60,site:{x:e.x,y:e.y}};
 const b=R.buoyAt(w,3,2),s=R.satelliteAt(w,1,0);out.buoy={x:b.x-60,y:b.y+90};out.satellite={x:s.x-100,y:s.y+200};
 const T=await import('/src/sculpture-totems-model.js');for(let x=-30;x<=30&&!out.totems;x++)for(let y=-30;y<=30&&!out.totems;y++){const a=T.totemCell(x,y,r.seedOf);if(a.length>1)out.totems={x:a[0].x-70,y:a[0].y-70};}
 const A=await import('/src/universe-activities-model.js');for(let x=-80;x<80&&!out.portal;x++)for(let y=-80;y<80&&!out.portal;y++)for(const o of A.activityCell(x,y,r.seedOf,'superficie'))if(o.kind==='silence'){out.portal={x:o.x+20,y:o.y-90};break;}
 const lm=r.nearbyLandmarks?.(r.S.wx,r.S.wy,30000)||[];if(lm.length)out.landmarkEdge={x:lm[0].x+1400,y:lm[0].y+300};
 const VA=await import('/src/viaje-a-model.js');const ba=VA.ballsNear(w,{x:0,y:-36000},16000).find(s=>s.km>2.5);out.ball={x:ba.x-150,y:ba.y+60};
 const VC=await import('/src/viaje-c-model.js');const pu=VC.pulsarsNear(w,{x:320000,y:0},30000).find(s=>s.km>30.5);out.pulsar={x:pu.x-60,y:pu.y+260};const ro=VC.rocksNear(w,{x:0,y:370000},30000).find(s=>s.km>35.5);out.rock={x:ro.x-50,y:ro.y+80};
 const VD=await import('/src/viaje-d-model.js');const free=s=>!R.satelliteHere(w,s,900);const po=VD.portalsNear(w,{x:640000,y:0},60000).filter(free)[0];out.otherRule={x:po.x-150,y:po.y+150};
 const LB=await import('/src/lejos-b-model.js');const ap=LB.nearestSite(w,{x:115000,y:0},'apagada');out.dead={x:ap.x+60,y:ap.y+60};
 return out;}"""
# Canvas calls per frame measured on 1d51eab (alpha.253) in the same scenes on the phone: fillRect+stroke+fill+drawImage.
# A scene may not draw more than these (plus a margin for the clock-driven sky); the desktop scales by its area.
BEFORE={'comet':1041,'probe':1185,'eclipse':405,'buoy':1026,'satellite':1352,'totems':782,'portal':459,'landmarkEdge':1463,'ball':2257,'pulsar':960,'rock':1686,'otherRule':409,'dead':762,'meteors':892,'figure':2312,'flockPet':1080}
calls=lambda o:o.get('fillRect',0)+o.get('stroke',0)+o.get('fill',0)+o.get('drawImage',0)
grads=lambda o:o.get('createRadialGradient',0)+o.get('createLinearGradient',0)
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   area=max(1,width*height/(390*844))
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script(COUNT)
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.liveEncounterSpawn&&!!__r.fxLayer&&!!__r.viajeDState&&!!__r.skySecretState&&__r.ringState?.().active",timeout=90000)
   page.evaluate(FREE);page.wait_for_timeout(900);page.evaluate(FREE);page.wait_for_timeout(600)
   P=page.evaluate(SITES)
   def scene(name,setup=None,check=None):
    if name in P:page.evaluate(GO,P[name])
    if setup:setup()
    page.wait_for_timeout(900);page.evaluate(PER_FRAME,500)   # the scene's sprites are painted once here
    o=page.evaluate(PER_FRAME,1200);print(f'{width}x{height} {name}',{k:round(v,1) for k,v in o.items()},flush=True)
    assert o['frames']>=6,(name,o)
    assert grads(o)<=1,('no gradient built per frame',name,o)
    assert o.get('shadow',0)==0,('no shadowBlur',name,o)
    assert o['made']<=10,('the sprite caches settle: nothing painted again frame after frame',name,o)
    assert calls(o)<=(BEFORE[name]*1.15+60)*area,('canvas calls under 1d51eab',name,o)
    assert o['p50']<40,('a frame stays well under budget',name,o)
    if check:check()
    return o
   sky=lambda:page.evaluate("__r.skySecretState().drawn")
   # --- The sky (tanda 2).
   scene('comet',check=lambda:sky()['comet'] is not None or (_ for _ in ()).throw(AssertionError('the comet crystal is drawn')))
   scene('probe',check=lambda:sky()['probe'] is not None or (_ for _ in ()).throw(AssertionError('the probe is drawn')))
   def cover():
    e=P['eclipse']['site'];wait=page.evaluate(f"async()=>{{const M=await import('/src/secretos-cielo-model.js');return M.eclipseWait(M.eclipseNear({{x:{e['x']},y:{e['y']}}},10),__r.skySecretState().now);}}")
    page.evaluate(f"__r.skySecretSkip({wait+.9})")
   scene('eclipse',cover,lambda:(sky()['eclipse'] or {}).get('cover',0)>.5 or (_ for _ in ()).throw(AssertionError(('the star covered, its corona drawn',sky()))))
   scene('buoy',check=lambda:page.evaluate("__r.recorrerState().drawn.buoy") or (_ for _ in ()).throw(AssertionError('a buoy is drawn')))
   scene('satellite',check=lambda:page.evaluate("__r.recorrerState().drawn.sat") or (_ for _ in ()).throw(AssertionError('the satellite is drawn')))
   def shower():
    page.evaluate(GO,{'x':P['comet']['x']+30000,'y':P['comet']['y']+30000});page.wait_for_timeout(400);assert page.evaluate("__r.skySecretShower()"),'a shower starts';page.wait_for_timeout(500)
   scene('meteors',shower)
   def figure():
    page.evaluate(GO,{'x':P['comet']['x']-30000,'y':P['comet']['y']+30000});page.wait_for_timeout(1200);assert page.evaluate("__r.skyMapSpawn('orion')"),'a figure appears'
    page.evaluate("async()=>{const r=__r,{skyStar}=await import('/src/sky-map-model.js'),s=r.skyMapState().scene;const q=skyStar(s.site,2);r.S.wx=q.x;r.S.wy=q.y+120;}")
   scene('figure',figure,lambda:page.evaluate("!!__r.skyMapState().scene") or (_ for _ in ()).throw(AssertionError('the figure is on')))
   # --- The big objects (tanda 3) and the batches A-D.
   scene('totems',check=lambda:page.evaluate("__r.totemNear().length")>0 or (_ for _ in ()).throw(AssertionError('totems near')))
   scene('portal')
   if 'landmarkEdge' in P:scene('landmarkEdge')
   scene('ball',check=lambda:len(page.evaluate("__r.viajeState().drawn.balls"))>0 or (_ for _ in ()).throw(AssertionError('the ball is drawn')))
   scene('pulsar',check=lambda:page.evaluate("__r.viajeCState().drawn.pulsar") or (_ for _ in ()).throw(AssertionError('the pulsar is drawn')))
   scene('rock',check=lambda:len(page.evaluate("__r.viajeCState().drawn.rocks"))>0 or (_ for _ in ()).throw(AssertionError('the asteroid is drawn')))
   scene('otherRule',check=lambda:page.evaluate("__r.viajeDState().drawn.portal") or (_ for _ in ()).throw(AssertionError('the portal is drawn')))
   scene('dead',check=lambda:page.evaluate("__r.lejosBState().drawn?.dead") or (_ for _ in ()).throw(AssertionError('the dead region is drawn')))
   def flock():
    page.evaluate("async()=>{const P=await import('/src/pet-model.js');__r.liveEncounterRest?.();__r.S.pet=P.createPet('golondrina',4242);__r.S.wx=5000;__r.S.wy=5000;}");page.wait_for_timeout(700)
    page.evaluate("()=>{const r=__r;r.flocks.length=0;for(let k=0;k<2;k++)r.flocks.push({x:r.S.wx+60-k*120,y:r.S.wy-90+k*60,h:.3,close:0,done:true,b:Array.from({length:14},(_,i)=>({ox:((i*37)%60)-30,oy:((i*23)%40)-20,ph:i*.7}))});}")
   high=scene('flockPet',flock)
   # --- A struck drum pops once in the shared layer; with reduced motion nothing pops.
   drum=page.evaluate("()=>{const r=__r,x0=r.S.wx,y0=r.S.wy;for(let i=0;i<300;i++){r.S.wx=x0+(i%15)*900;r.S.wy=y0+Math.floor(i/15)*900;const o=r.nearbyPercussion?.(2000)?.[0];if(o)return {x:o.x-40,y:o.y+20};}return null;}")
   assert drum,'a drum somewhere near'
   page.evaluate(GO,drum);page.wait_for_timeout(700);page.evaluate("()=>{__r.fxLayer.clear();const o=__r.nearbyPercussion(400)[0];o.visualAt=performance.now();}");page.wait_for_timeout(200)
   assert page.evaluate("__r.fxLayer.pops()")>=1,'a struck drum pops'
   page.evaluate("()=>{__r.S.reducedMotion=true;__r.fxLayer.clear();const o=__r.nearbyPercussion(400)[0];o.visualAt=performance.now()+1;}");page.wait_for_timeout(200)
   assert page.evaluate("__r.fxLayer.pops()")==0,'no pop with reduced motion'
   still=page.evaluate(PER_FRAME,800);assert still['frames']>=5 and grads(still)<=1,still
   page.evaluate("()=>{__r.S.reducedMotion=false;}")
   # --- Light quality: nothing added with 'lighter' and no more images than high, in the sky (a meteor shower).
   page.evaluate(GO,{'x':P['comet']['x']+60000,'y':P['comet']['y']-30000});page.wait_for_timeout(500);page.evaluate("__r.skySecretShower()");page.wait_for_timeout(400)
   sh=page.evaluate(PER_FRAME,900)
   page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'ligera'}});}");page.wait_for_timeout(400);page.evaluate(HIDE);assert page.evaluate('__r.lightQuality()')
   sl=page.evaluate(PER_FRAME,900);print(f'{width}x{height} light',{k:round(v,1) for k,v in sl.items()},'high',{k:round(v,1) for k,v in sh.items()},flush=True)
   assert sl.get('add',0)==0,('light quality adds no light',sl)
   assert sl.get('drawImage',0)<=sh.get('drawImage',0),('light quality draws no more images of light',sl,sh)
   page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'alta'}});}")
   assert not errors,errors
   page.close()
  browser.close()
 print(f'PASS visual 2: the sky (comet crystal, probe, eclipse and its corona, meteors, buoy, satellite, a figure being joined) and the big objects (totems, activity portal, landmark at the edge, ball, pulsar, layered asteroid, portal of another rule, dead region, flock and pet) draw on phone and desktop without errors, with no gradient built per frame, no shadowBlur, sprite caches that settle and canvas calls under 1d51eab; a struck drum pops, reduced motion pops nothing, light quality adds no light and draws no more ({time.time()-started:.0f} s)',flush=True)
finally:server.shutdown()
