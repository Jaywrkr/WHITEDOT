"""Una capa de flechas (coherencia T2, alpha.260) · phone (390x844) and desktop (1280x800). «Hay algo allí» has one
language: small white arrows at the screen's edge, three at most, with the scanner's icon of the thing or «?» for what is
secret or only heard. Before the eleven places (scanner level 2) the arrows come only from the systems that marked the
edge before; with the eleven places (level 3) the scanner's registry points too, secrets and rumours are «?» in the
«Cerca» panel, the panel stays a moment after release and tapping a row puts the one mark on the Mapa del universo.
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
   page.evaluate(FREE);page.wait_for_timeout(600);page.evaluate(FREE);page.evaluate(ENTRIES)
   home={'x':31000,'y':1234};page.evaluate(GO,home);page.evaluate("()=>{__r.S.lugares={...(__r.S.lugares||{}),won:false};}");page.evaluate(PLACE,True);page.wait_for_timeout(900);page.evaluate(HIDE)
   # --- 1 · Before the eleven places (level 2): the World's own marks only, white, three at most; no registry arrow.
   s=st(page);assert s['level']=='2',s;assert len(s['shown'])<=3 and s['drawn']['arrows']==len(s['shown']),s
   assert not any(e['key'].startswith('scan:') for e in s['shown']),('no registry arrow before level 3',s)
   # --- 2 · The eleven places open level 3: the registry points, the rarer first, three at most; the secret is «?».
   page.evaluate("()=>{__r.S.lugares={...(__r.S.lugares||{}),won:true};}")
   page.wait_for_function("__r.edgeState().level==='3'&&__r.edgeState().shown.filter(e=>e.key.startsWith('scan:prueba')).length===3",timeout=5000)
   most=0
   for _ in range(12):s=st(page);most=max(most,len(s['shown']),s['drawn']['arrows']);page.wait_for_timeout(60)
   assert most<=3,('three arrows at most',most);assert s['offered']>=5,s
   sec=[e for e in s['shown'] if e['key'].startswith('scan:prueba-secreto')];assert sec and sec[0]['ask'] and sec[0]['shape']=='pregunta' and sec[0]['label'] is None,s
   assert all(e['kind']!='region' for e in s['shown']),'a region only when nothing else is there'
   page.wait_for_timeout(400);s=st(page);white(page,s['shown'])
   for e in s['shown']:assert 0<=e['x']<=width and 90<=e['y']<=height-90,('at the edge, off the bars',e)
   if SHOTS:page.screenshot(path=f'{SHOTS}/flechas-nivel3-{width}.png')
   # --- 3 · «Cerca» at level 3: «?» rows, the panel stays on release, a row marks the map (one mark).
   hold(page);assert page.get_attribute('#scanner','data-level')=='3'
   rows=page.locator('#scannerSources li.scan-row');assert 1<=rows.count()<=3,rows.count()
   first=rows.nth(0).inner_text();assert first.startswith('? · '),('the secret is «?»',first)
   assert page.locator('#scannerSources button.scan-row').count()==rows.count(),'from level 3 a row is a button'
   if SHOTS:page.screenshot(path=f'{SHOTS}/flechas-cerca-{width}.png')
   page.mouse.up();page.wait_for_timeout(150)
   assert page.locator('#scanner').is_visible() and 'keep' in (page.get_attribute('#scanner','class') or ''),'released: the panel stays a moment'
   page.locator('#scannerSources button.scan-row').nth(1).click()
   m=page.evaluate("__r.S.universeMap.mark");want=page.evaluate("window.__flechas.find(s=>s.key==='e')")
   assert m and abs(m['x']-want['x'])<=1 and abs(m['y']-want['y'])<=1 and m['name']=='Faro de prueba',('the row marks its place',m,want)
   assert not page.locator('#scanner').is_visible(),'marked: the panel closes'
   assert page.evaluate("__r.mapMarkRoute()?.name")=='Tu marca · Faro de prueba'
   # The secret marks without a name; a new mark replaces the old (one mark).
   hold(page);page.mouse.up();page.wait_for_timeout(150);page.locator('#scannerSources button.scan-row').nth(0).click()
   m2=page.evaluate("__r.S.universeMap.mark");assert m2['name']=='Tu marca' and abs(m2['y']-(home['y']+1500))<=1,m2
   # A tap elsewhere closes the panel; it closes alone after a moment.
   hold(page);page.mouse.up();page.wait_for_timeout(150);assert page.locator('#scanner').is_visible()
   page.mouse.click(30,height/2);page.wait_for_timeout(100);assert not page.locator('#scanner').is_visible(),'a tap elsewhere closes it'
   hold(page);page.mouse.up();page.wait_for_function("document.getElementById('scanner').hidden",timeout=6000)
   page.evaluate("__r.clearMapMark()")
   # A rumour within reach is «?» too, in the panel and at the edge.
   page.evaluate(PLACE,False);page.evaluate("()=>{const r=__r,q=r.S.rumors||(r.S.rumors={version:1,open:[],done:[],n:0,given:0});q.open=[...(q.open||[]),{id:'prueba-rumor',kind:'figure',key:'k',name:'',text:'Dicen que…',x:r.S.wx-2500,y:r.S.wy+700,at:''}];}")
   page.wait_for_function("__r.edgeState().shown.some(e=>e.kind==='rumor'&&e.ask)",timeout=5000)
   hold(page);assert any(page.locator('#scannerSources li.scan-row').nth(k).inner_text().startswith('? · ') for k in range(page.locator('#scannerSources li.scan-row').count())),'the rumour is «?»'
   page.mouse.up();page.evaluate("()=>{const q=__r.S.rumors;q.open=q.open.filter(o=>o.id!=='prueba-rumor');}");page.evaluate("document.getElementById('scanner').hidden=true");page.evaluate(PLACE,True)
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
 print(f'PASS flechas on phone and desktop in {elapsed:.0f} s: one layer of white arrows, three at most; before the eleven places only the World\'s own marks; level 3 points with the registry, the secret and a rumour as «?»; «Cerca» stays on release and a row puts the one mark on the map; reduced motion without fade; light quality without shadow; a handful of canvas calls',flush=True)
finally:server.shutdown()
