"""Visual 3 (alpha.255): the World's ambience, on a phone (390x844) and a desktop (1280x800). The background stars are
three layers repeating a cached tile pattern (paths and small sprites, no point drawn one by one); the Bosque and the Jardín have a ground of their own; a region's
aurora is one sliding strip; at a stage that sounds with «Escenas» on (the Almacén and the Patio latino) beams and a
floor beat with it, and with the setting off at the same stage nothing is drawn; the Refugio has its warm light. The cost per frame does not go up against a5f253f (alpha.254): no gradient per frame (the Refugio's backdrop keeps its one), no
shadowBlur, sprite caches that settle, and canvas calls under those measured on a5f253f (scaled by the screen's area on
the desktop). With reduced motion the stars keep one depth and the print of a scene stays still; light quality draws two
layers of stars, no ground, no beams and adds no more light."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('VISUAL3_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Canvas calls on the World's canvas (#w) per frame: draws, gradients, shadowBlur, and images added with 'lighter'.
COUNT="""(()=>{const P=CanvasRenderingContext2D.prototype,C=window.__cc={};window.__frames=0;window.__ft=[];
 for(const m of ['fillRect','stroke','fill','drawImage','createRadialGradient','createLinearGradient']){const o=P[m];P[m]=function(...a){if(this.canvas&&this.canvas.id==='w'){C[m]=(C[m]||0)+1;if(m==='drawImage'&&this.globalCompositeOperation==='lighter')C.add=(C.add||0)+1;}return o.apply(this,a);};}
 const d=Object.getOwnPropertyDescriptor(P,'shadowBlur');Object.defineProperty(P,'shadowBlur',{configurable:true,get(){return d.get.call(this);},set(v){if(v>0&&this.canvas&&this.canvas.id==='w')C.shadow=(C.shadow||0)+1;d.set.call(this,v);}});
 const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(t=>{const s=performance.now();try{cb(t);}finally{window.__frames++;window.__ft.push(performance.now()-s);if(window.__ft.length>300)window.__ft.shift();}});})();"""
PER_FRAME="""async(ms)=>{const K=await import('/src/fx-kit.js'),m0=K.fxSpritesMade();for(const k in __cc)delete __cc[k];const f0=__frames;__ft.length=0;await new Promise(r=>setTimeout(r,ms));
 const n=Math.max(1,__frames-f0),o={frames:n,made:K.fxSpritesMade()-m0};for(const k in __cc)o[k]=__cc[k]/n;const s=[...__ft].sort((a,b)=>a-b);o.p50=s[Math.floor(s.length/2)]||0;return o;}"""
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.S.firstJourney&&(r.S.firstJourney.skipped=true);r.S.pathCrystals=Array.from({length:10},(_,i)=>'v3:'+i);r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};if(!r.inWorld())r.enterWorld?.({automatic:true});r.stopAutopilot?.();if(r.S.bandas&&r.bandState)for(const e of r.bandState().entries)r.S.bandas.seen[e.id]='';r.save();}"
GO="(p)=>{const r=__r;"+HIDE+";r.liveEncounterRest?.();r.S.wx=p.x;r.S.wy=p.y;if(r.body){r.body.x=r.body.px=p.x;r.body.y=r.body.py=p.y;}r.stopAutopilot?.();}"
# Fixed sites: the nearest Bosque, Jardín and Void wholly on screen, and the nearest stage of each scene.
SITES="""async()=>{const r=__r,out={},ids=r.BIOMES.map(b=>b.id),C=r.WCH;
 const same=(x,y,id)=>[[0,0],[-300,-450],[300,450],[-300,450],[300,-450]].every(([a,b])=>ids[r.biomeOfPos(x+a,y+b)]===id);
 const find=id=>{for(let R=1;R<80;R++)for(let i=-R;i<=R;i++)for(const [a,b] of [[i,-R],[i,R],[-R,i],[R,i]]){const x=(a+.5)*C,y=(b+.5)*C;if(same(x,y,id))return {x,y};}return null;};
 for(const id of ['bosque','jardin','vacio'])out[id]=find(id);
 const M=await import('/src/scenes-model.js'),world=M.sceneWorldKey(r.worldIdentity??r.S.worldIdentity),RP=r.REG*r.WCH,under=(x,y)=>{const d=r.regionOfPos(x,y);return {genre:d.genre,sea:!!d.sea};};
 for(const sc of ['almacen','patio']){let got=null;for(let R=0;R<40&&!got;R++)for(let zx=-R;zx<=R&&!got;zx++)for(let zy=-R;zy<=R&&!got;zy++){if(Math.max(Math.abs(zx),Math.abs(zy))!==R)continue;const s=M.stageInZone(world,zx,zy,under,RP);if(s&&s.scene===sc)got={x:s.x,y:s.y,id:s.id};}out[sc]=got;}
 return out;}"""
# Canvas calls per frame measured on a5f253f (alpha.254) in the same scenes on the phone: fillRect+stroke+fill+drawImage.
BEFORE={'bosque':1123,'jardin':1122,'vacio':453,'aurora':1529,'escena-off':3933,'almacen':3426,'patio':1038,'refugio':367}
calls=lambda o:o.get('fillRect',0)+o.get('stroke',0)+o.get('fill',0)+o.get('drawImage',0)
grads=lambda o:o.get('createRadialGradient',0)+o.get('createLinearGradient',0)
amb=lambda page:page.evaluate("__r.ambientState()")
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   area=max(1,width*height/(390*844))
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script(COUNT)
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.ambientState&&!!__r.sceneState&&!!__r.enterHouse&&__r.ringState?.().active",timeout=90000)
   page.evaluate(FREE);page.wait_for_timeout(900);page.evaluate(FREE);page.wait_for_timeout(600)
   P=page.evaluate(SITES);assert all(P.get(k) for k in ['bosque','jardin','vacio','almacen','patio']),P
   def measure(name,check=None,settle=900):
    page.wait_for_timeout(settle);page.evaluate(PER_FRAME,500)   # the scene's sprites are painted once here
    o=page.evaluate(PER_FRAME,1200);print(f'{width}x{height} {name}',{k:round(v,1) for k,v in o.items()},flush=True)
    assert o['frames']>=6,(name,o)
    assert grads(o)<=(1 if name=='refugio' else .5),('no gradient built per frame (the Refugio keeps its backdrop\'s one)',name,o)
    assert o.get('shadow',0)==0,('no shadowBlur',name,o)
    assert o['made']<=10,('the sprite caches settle',name,o)
    if name in BEFORE:assert calls(o)<=(BEFORE[name]*1.15+60)*area,('canvas calls under a5f253f',name,o)
    if check:check()
    if SHOTS:page.evaluate(HIDE);page.screenshot(path=f'{SHOTS}/{name}-{width}.png')
    return o
   def scene(name,check=None):page.evaluate(GO,P[name]);return measure(name,check)
   # --- Stars in three layers of tiles; the ground of the Bosque and the Jardín, none in the Void.
   def stars_and_ground(n):
    a=amb(page);assert a['stars'] and a['stars']['layers']==3 and a['stars']['drawn']>=9,a
    assert (a['ground']['cells']>0)==(n>0),(n,a)
   scene('bosque',lambda:stars_and_ground(1))
   high=scene('jardin',lambda:stars_and_ground(1))
   scene('vacio',lambda:stars_and_ground(0))
   # --- A region's aurora: one sliding strip instead of three long lines.
   # A place with no storm passing (storms move with the real clock and turn the sky's event into rain).
   for k in range(8):
    page.evaluate(GO,{'x':P['vacio']['x']+2000+k*3000,'y':P['vacio']['y']+k*1500});page.wait_for_timeout(700)
    if page.evaluate("(__r.MU.storm||0)<.05"):break
   page.evaluate("()=>{const r=__r,d=r.regionOfPos(r.S.wx,r.S.wy);d.ev=['aurora','Aurora','El cielo canta en otro color.'];d.evDay=r.S.todayKey;}")
   def aurora():
    a=amb(page);assert a['aurora'] and a['aurora']['drawn']>=1,a;t0=a['aurora']['at']
    page.wait_for_function(f"__r.ambientState().aurora.at>{t0}",timeout=8000)   # drawn frame after frame
   measure('aurora',aurora)
   page.evaluate("()=>{const r=__r,d=r.regionOfPos(r.S.wx,r.S.wy);d.ev=null;}")
   # --- Scenes: with the setting off at a stage, nothing; on, beams and a floor while it sounds.
   page.evaluate("()=>{const r=__r;r.S.sound=true;r.audio?.();}");page.wait_for_function("__r.ac?.state==='running'",timeout=20000)
   page.evaluate(GO,{'x':P['almacen']['x']+40,'y':P['almacen']['y']+160});page.wait_for_timeout(1500)
   def off():
    st=page.evaluate("__r.sceneState()");assert not st['on'] and not st['bus'],st;assert amb(page)['scene'] is None,'no print with the setting off'
   measure('escena-off',off,settle=1500)
   for sc in ['almacen','patio']:
    page.evaluate("()=>{const r=__r;r.sceneArcFrom=24;r.setScenes(true);}")
    page.evaluate(GO,{'x':P[sc]['x']+60000,'y':P[sc]['y']});page.wait_for_timeout(1200)
    page.evaluate(GO,{'x':P[sc]['x']+40,'y':P[sc]['y']+160});page.wait_for_function("__r.sceneState().bus&&__r.sceneState().prox>.5&&!!__r.ambientState().scene?.floor",timeout=30000)
    def printed(sc=sc):
     page.wait_for_function("__r.sceneState().prox>.5&&!!__r.ambientState().scene?.floor",timeout=30000)
     a=amb(page)['scene'];assert a and a['scene']==sc and a['floor'] and a['beams']==(2 if sc=='patio' else 3),a
     if sc=='patio':assert a['bulbs']==16,a
    measure(sc,printed,settle=2500)
   # Reduced motion at the stage: the print stays (still), the stars keep one depth.
   page.evaluate("()=>{__r.S.reducedMotion=true;}");page.wait_for_timeout(400)
   still=page.evaluate(PER_FRAME,800);assert still['frames']>=5 and grads(still)<=.5,still
   a=amb(page);assert a['scene'] and a['scene']['beams']==2 and a['stars']['layers']==3 and a['stars']['still'],a
   page.evaluate("()=>{__r.S.reducedMotion=false;}")
   # Off again at the stage: the print goes with the setting (and the club fades away).
   page.evaluate("()=>{__r.setScenes(false);}");page.wait_for_timeout(300);assert amb(page)['scene'] is None,'the setting off: no print'
   page.evaluate("()=>{const r=__r;r.sceneArcFrom=undefined;r.S.sound=false;}")
   # --- Light quality: two layers of stars, no ground, no beams, nothing more added.
   page.evaluate(GO,P['jardin']);page.wait_for_timeout(500)
   page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'ligera'}});}");page.wait_for_timeout(500);page.evaluate(HIDE);assert page.evaluate('__r.lightQuality()')
   sl=page.evaluate(PER_FRAME,900);a=amb(page);print(f'{width}x{height} light',{k:round(v,1) for k,v in sl.items()},flush=True)
   assert a['stars']['layers']==2 and a['ground']['cells']==0,a
   assert sl.get('add',0)<=high.get('add',0),('light quality adds no more light',sl,high)
   assert calls(sl)<=calls(high),('light quality draws no more',sl,high)
   page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'alta'}});}");page.wait_for_timeout(300)
   # --- The Refugio: its warm light from sprites; the backdrop keeps its one gradient, as before.
   page.evaluate("()=>{"+HIDE+";__r.enterHouse();}");page.wait_for_function('__r.houseSettled()',timeout=30000)
   measure('refugio',settle=1200)
   assert not errors,errors
   page.close()
  browser.close()
 print(f'PASS visual 3: stars in three layers, the ground of the Bosque and the Jardín, the aurora strip, the print of a scene only while it sounds with «Escenas» on, and the Refugio light, on phone and desktop without errors, with no gradient built per frame, no shadowBlur, sprite caches that settle and canvas calls under a5f253f; reduced motion keeps the print still and one depth of stars; light quality draws two layers, no ground, no beams and adds no more ({time.time()-started:.0f} s)',flush=True)
finally:server.shutdown()
