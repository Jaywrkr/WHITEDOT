"""Una capa de flechas (coherencia T2, alpha.260) · phone (390x844) and desktop (1280x800). «Hay algo allí» has one
language: small white arrows at the screen's edge, three at most, with the scanner's icon of the thing or «?» for what is
secret or only heard. Before the eleven places (scanner level 2) the arrows come only from the systems that marked the
edge before; with the eleven places (level 3) the scanner's registry points too, and secrets and rumours are «?».
Escáner NMS (alpha.263): a scan shows them as marks on the canvas («? · 150 m»), no panel, and while the marks show an
arrow does not say the same thing twice; the map keeps its own «Marcar» (scanning marks nothing).
Reduced motion: an arrow is there at once. Light quality: no gradient or shadow and no more calls. The cost: a handful of
canvas calls for the arrows. Only white: the bright pixels of every arrow have no colour."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('FLECHAS_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
COUNT="""(()=>{const P=CanvasRenderingContext2D.prototype,C=window.__cc={};window.__frames=0;
 for(const m of ['fillRect','stroke','fill','drawImage','fillText','strokeRect','createRadialGradient','createLinearGradient']){const o=P[m];P[m]=function(...a){if(this.canvas&&this.canvas.id==='w')C[m]=(C[m]||0)+1;return o.apply(this,a);};}
 const d=Object.getOwnPropertyDescriptor(P,'shadowBlur');Object.defineProperty(P,'shadowBlur',{configurable:true,get(){return d.get.call(this);},set(v){if(v>0&&this.canvas&&this.canvas.id==='w')C.shadow=(C.shadow||0)+1;d.set.call(this,v);}});
 const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(t=>{try{cb(t);}finally{window.__frames++;}});})();"""
PER_FRAME="""async(ms)=>{for(const k in __cc)delete __cc[k];const f0=__frames;await new Promise(r=>setTimeout(r,ms));
 const n=Math.max(1,__frames-f0),o={frames:n};for(const k in __cc)o[k]=__cc[k]/n;return o;}"""
calls=lambda o:sum(o.get(k,0) for k in ['fillRect','stroke','fill','drawImage','fillText','strokeRect'])
grads=lambda o:o.get('createRadialGradient',0)+o.get('createLinearGradient',0)
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.liveEncounterRest?.();r.save();}"
# Five test things 150–290 m around the cube (rarer than anything of the World, so they lead), one of them a secret.
ENTRIES="""async()=>{const M=await import('/src/scanner-model.js');if(!M.scanEntry('prueba-flecha')){
 M.registerScan({id:'prueba-flecha',name:'Faro de prueba',shape:'sonda',level:1,rarity:3,sites:p=>window.__flechas?window.__flechas.filter(s=>!s.secret):[]});
 M.registerScan({id:'prueba-secreto',name:'Secreto de prueba',shape:'estrella',level:3,rarity:3,secret:true,sites:p=>window.__flechas?window.__flechas.filter(s=>s.secret):[]});}return true;}"""
PLACE="""(on)=>{const r=__r;window.__flechas=on?[{key:'e',x:r.S.wx+2600,y:r.S.wy},{key:'s',x:r.S.wx,y:r.S.wy+1500,secret:true},{key:'w',x:r.S.wx-2800,y:r.S.wy},{key:'n',x:r.S.wx,y:r.S.wy-2900},{key:'se',x:r.S.wx+2000,y:r.S.wy+2000}]:null;return true;}"""
GO="(p)=>{const r=__r;r.S.wx=p.x;r.S.wy=p.y;if(r.body){r.body.x=r.body.px=p.x;r.body.y=r.body.py=p.y;}r.liveEncounterRest?.();}"
def st(page):return page.evaluate("__r.edgeState()")
# The bright pixels round each arrow, read from the World's canvas: white (no gold, no cyan, no biome colour).
WHITE="""(shown)=>{const cv=document.getElementById('w'),c=cv.getContext('2d'),k=cv.width/cv.clientWidth,out=[];
 for(const e of shown){const x=Math.round((e.x-10)*k),y=Math.round((e.y-10)*k),n=Math.round(20*k),d=c.getImageData(Math.max(0,x),Math.max(0,y),n,n).data;let bright=0,worst=0;
  for(let i=0;i<d.length;i+=4){if(d[i]+d[i+1]+d[i+2]>600){bright++;worst=Math.max(worst,Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2]));}}out.push({key:e.key,bright,worst});}return out;}"""
def white(page,shown):
 for o in page.evaluate(WHITE,shown):
  assert o['bright']>0,('the arrow is drawn',o)
  assert o['worst']<=40,('only white',o)
def hold(page,ms=650):
 w,h=page.viewport_size['width'],page.viewport_size['height'];page.mouse.move(w/2+70,h/2-90);page.mouse.down();page.wait_for_timeout(ms)
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script(COUNT)
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.edgeState&&__r.ringState?.().active",timeout=90000)
   # Alpha.264: each trophy upgrades the radar; as a new player after the Llanura (one trophy), level 2 at 120 m.
   page.evaluate("()=>{__r.S.journey.done={llanura:true};const d=__r.placesData();for(const id of Object.keys(d.stars))if(id!=='llanura')d.stars[id]=[false,false,false];}")
   page.evaluate(FREE);page.wait_for_timeout(600);page.evaluate(FREE);page.evaluate(ENTRIES)
   home={'x':31000,'y':1234};page.evaluate(GO,home);page.evaluate("()=>{__r.S.lugares={...(__r.S.lugares||{}),won:false};}");page.evaluate(PLACE,True);page.wait_for_timeout(900);page.evaluate(HIDE)
   # --- 1 · Before the eleven places (level 2): the World's own marks only, white, three at most; no registry arrow.
   s=st(page);assert s['level']=='2',s;assert len(s['shown'])<=3 and s['drawn']['arrows']==len(s['shown']),s
   assert not any(e['key'].startswith('scan:') for e in s['shown']),('no registry arrow before level 3',s)
   # --- 2 · The eleven places open level 3: the registry points, the rarer first, three at most; the secret is «?».
   page.evaluate("()=>{__r.S.lugares={...(__r.S.lugares||{}),won:true};}")
   # Alpha.264: the next place's arrow («lugar», over the rare) keeps one of the three.
   page.wait_for_function("(()=>{const s=__r.edgeState().shown;return __r.edgeState().level==='3'&&s.filter(e=>e.key.startsWith('scan:prueba')).length===3-(s.some(e=>e.kind==='lugar')?1:0);})()",timeout=5000)
   most=0
   for _ in range(12):s=st(page);most=max(most,len(s['shown']),s['drawn']['arrows']);page.wait_for_timeout(60)
   assert most<=3,('three arrows at most',most);assert s['offered']>=5,s
   sec=[e for e in s['shown'] if e['key'].startswith('scan:prueba-secreto')];assert sec and sec[0]['ask'] and sec[0]['shape']=='secreto' and sec[0]['label'] is None,s
   assert all(e['kind']!='region' for e in s['shown']),'a region only when nothing else is there'
   page.wait_for_timeout(400);s=st(page);white(page,s['shown'])
   for e in s['shown']:assert 0<=e['x']<=width and 90<=e['y']<=height-90,('at the edge, off the bars',e)
   if SHOTS:page.screenshot(path=f'{SHOTS}/flechas-nivel3-{width}.png')
   # --- 3 · A scan at level 3 (Escáner NMS): marks on the canvas, the secret «?», no panel, the map untouched.
   page.evaluate("__r.clearMapMark()");hold(page,1500);sc=page.evaluate("__r.scanState()")
   assert sc['level']=='3' and not page.locator('#scanner').is_visible(),('no panel',sc['level'])
   mk=[m for m in sc['marks'] if m['id'].startswith('prueba')];assert len(mk)>=3,sc['marks']
   q=[m for m in mk if m['id']=='prueba-secreto'];assert q and q[0]['shape']=='secreto' and q[0]['label'].startswith('? · '),('the secret is «?»',q)
   f=[m for m in mk if m['id']=='prueba-flecha'];assert f and all(m['label'].startswith('Faro de prueba · ') and m['shape']=='sonda' for m in f),f
   if SHOTS:page.screenshot(path=f'{SHOTS}/flechas-marcas-{width}.png')
   page.mouse.up();page.wait_for_timeout(400)
   s=st(page);assert not any(e['key'].startswith('scan:prueba') for e in s['shown']),('while the marks show, no arrow says the same',s['shown'])
   assert not page.evaluate("__r.S.universeMap?.mark"),'scanning marks nothing on the map'
   # A rumour within reach is «?» too, on the canvas and at the edge.
   page.evaluate(PLACE,False);page.evaluate("()=>{const r=__r,q=r.S.rumors||(r.S.rumors={version:1,open:[],done:[],n:0,given:0});q.open=[...(q.open||[]),{id:'prueba-rumor',kind:'figure',key:'k',name:'',text:'Dicen que…',x:r.S.wx-2500,y:r.S.wy+700,at:''}];}")
   page.wait_for_function("__r.scanState().left===0",timeout=12000)
   page.wait_for_function("__r.edgeState().shown.some(e=>e.kind==='rumor'&&e.ask)",timeout=5000)
   hold(page,1500);rm=[m for m in page.evaluate("__r.scanState()")['marks'] if m['id']=='rumores'];assert rm and rm[0]['shape']=='secreto' and rm[0]['label'].startswith('? · '),('the rumour is «?»',rm)
   page.mouse.up();page.evaluate("()=>{const q=__r.S.rumors;q.open=q.open.filter(o=>o.id!=='prueba-rumor');}");page.evaluate(PLACE,True)
   page.wait_for_function("__r.scanState().left===0&&__r.scanState().marks.length===0",timeout=12000)
   # --- 4 · Reduced motion: a new arrow is there at once (no fade in).
   page.evaluate("()=>{__r.S.reducedMotion=true;}");page.evaluate(GO,{'x':home['x']+20000,'y':home['y']});page.evaluate(PLACE,True);page.wait_for_timeout(400)
   s=st(page);assert s['shown'] and all(e['k']==1 for e in s['shown']),('still: no fade',s)
   page.evaluate("()=>{__r.S.reducedMotion=false;}")
   # --- 5 · Light quality: no gradient or shadow from the arrows and no more calls than the full quality.
   page.evaluate(GO,home);page.evaluate(PLACE,True);page.wait_for_timeout(500);page.evaluate(HIDE)
   page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'ligera'}});}");page.wait_for_timeout(400);page.evaluate(HIDE)
   light=page.evaluate(PER_FRAME,800);ls=st(page)
   page.evaluate("()=>{__r.$('graphicsQuality').onchange({target:{value:'alta'}});}");page.wait_for_timeout(400);page.evaluate(HIDE)
   assert ls['drawn']['arrows']>=1 and light.get('shadow',0)==0,(ls,light)
   # --- 6 · The cost of three arrows: the same frame with and without them.
   on,off=[],[]
   for _ in range(3):
    page.evaluate(PLACE,True);page.wait_for_timeout(300);on.append(page.evaluate(PER_FRAME,700));na=st(page)['drawn']['arrows']
    page.evaluate(PLACE,False);page.wait_for_timeout(300);off.append(page.evaluate(PER_FRAME,700));nb=st(page)['drawn']['arrows']
   a,b=sorted(calls(o) for o in on)[1],sorted(calls(o) for o in off)[1]
   print(f'{width}x{height} canvas calls per frame: {na} arrows {a:.1f}, {nb} arrows {b:.1f}',flush=True)
   assert na==3 and a-b<=4*(na-nb)+12,('an arrow costs a handful of calls',a,b,na,nb);assert max(grads(o) for o in on)<=max(grads(o) for o in off)+.5,(on,off)
   assert not errors,errors;page.close()
  browser.close()
 elapsed=time.time()-started
 print(f'PASS flechas on phone and desktop in {elapsed:.0f} s: one layer of white arrows, three at most; before the eleven places only the World\'s own marks; level 3 points with the registry, the secret and a rumour as «?»; a scan shows them as marks with no panel, no arrow repeats a mark, the map untouched; reduced motion without fade; light quality without shadow; a handful of canvas calls',flush=True)
finally:server.shutdown()
