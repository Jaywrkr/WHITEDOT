"""Panel 10 (P7, D4, Roset): the colour is earned and seen. After the Journey with the eleven places complete, the map
and the portals show the colour of each place (at least five hues of LANDSCAPES, no complete portal in the generic gold);
the chapter marks take their place's colour; recovering a biome's colour takes one bar from the cube (grey 1 → 0,05 in
≥ 2 s) and leaves its colour on the shapes with a black ground (median below RGB 20, > 2 % of pixels with chroma > 24);
in colour-blind mode no two places share a colour; the recording pill is white with a blinking dot."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
LANDSCAPES={'llanura':'#eb9a3c','bosque':'#6fe08a','lago':'#5cc8ff','ruinas':'#a88c6a','jardin':'#ff8fc8','dunas':'#f3e6b0','cristales':'#9ef0e6','faros':'#fff36a','tormenta':'#b48cff','cueva':'#ff4f3a','vacio':'#ffffff'}
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
# Pixels of a canvas: how many match each hex (exact colour of a stroke drawn at full alpha), the median and the chroma.
PIXELS="""(args)=>{const hue=(r,g,b)=>{const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn||1;let h=mx===r?(g-b)/d:mx===g?2+(b-r)/d:4+(r-g)/d;return (h*60+360)%360;};const [id,hexes]=args,c=document.getElementById(id),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data,n=d.length/4,count={},want=hexes.map(h=>[h,parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]);
 let chroma=0;const R=[],G=[],B=[];for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2];if(Math.max(r,g,b)-Math.min(r,g,b)>24)chroma++;if(i%16===0){R.push(r);G.push(g);B.push(b);}
  for(const [h,wr,wg,wb] of want)if(Math.abs(r-wr)<=3&&Math.abs(g-wg)<=3&&Math.abs(b-wb)<=3)count[h]=(count[h]||0)+1;
  if(Math.max(r,g,b)-Math.min(r,g,b)>24)for(const [h,wr,wg,wb] of want){const hp=hue(r,g,b),hw=hue(wr,wg,wb),dh=Math.min(Math.abs(hp-hw),360-Math.abs(hp-hw));if(dh<10)count['~'+h]=(count['~'+h]||0)+1;}}
 const med=a=>a.sort((x,y)=>x-y)[a.length>>1];return {count,chroma:chroma/n,median:[med(R),med(G),med(B)]};}"""
def page(b,q):
 p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{srv.server_port}/{q}');p.wait_for_function('!!window.__r?.drawWorldSheet',timeout=20000);p.wait_for_timeout(1200);p.evaluate(HIDE);return p,errors
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  # 1. The ring after the Journey: complete places in their colour, gold only for stars.
  p,errors=page(b,'?anillo=1')
  p.evaluate("()=>{const d=__r.placesData();for(const id of Object.keys(d.stars))d.stars[id]=[true,false,false];}")
  portals=p.evaluate('__r.ringPortals()');assert len(portals)==11,portals
  inks={q['id']:q['ink'] for q in portals};assert all(q['complete'] for q in portals),portals
  assert '#f0d27a' not in inks.values(),inks
  assert all(inks[k]==LANDSCAPES[k] for k in inks),inks
  p.evaluate("()=>__r.openMap()");p.wait_for_timeout(400)
  seen=p.evaluate(PIXELS,['mapCv',list(LANDSCAPES.values())])['count']
  hues=sorted({h.lstrip('~') for h,n in seen.items() if n>=6 and h.lstrip('~')!='#ffffff'});assert len(hues)>=5,('at least five place colours on the map',seen)
  # On screen: the portal of a complete place, beside it, drawn in its colour.
  p.evaluate("()=>{"+HIDE+";const s=__r.ringState().spots.find(q=>q.id==='lago');__r.S.wx=s.x+120;__r.S.wy=s.y;}");p.wait_for_timeout(500)
  assert p.evaluate("__r.ringState().spots.find(q=>q.id==='lago').ink")=='#5cc8ff'
  lago=p.evaluate(PIXELS,['w',['#5cc8ff']])['count'];assert lago.get('~#5cc8ff',0)>=30,('the Lago portal in its colour',lago)
  # Colour-blind: every portal still its own colour.
  p.evaluate("()=>{__r.S.colorSafe=true;}");safe=[q['ink'] for q in p.evaluate('__r.ringPortals()')];assert len(set(safe))==11,safe
  assert not errors,errors;p.close()
  # 2. A chapter: the marks take their colour; recovering the colour takes one bar from the cube, then pigment.
  p,errors=page(b,'?capitulo=lago')
  p.evaluate("()=>{const r=__r;r.S.sound=true;r.audio();r.S.journey.done=r.S.journey.done||{};r.S.journey.done.llanura=true;}")
  p.wait_for_function("__r.ac?.state==='running'",timeout=10000);p.wait_for_timeout(400);p.evaluate(HIDE)
  marks=p.evaluate(PIXELS,['w',['#eb9a3c']])['count'];assert marks.get('#eb9a3c',0)>=9 or marks.get('~#eb9a3c',0)>=12,('the Llanura mark in its colour',marks)
  p.wait_for_function("__r.worldSheetState().grey>.9",timeout=5000);assert p.evaluate('__r.worldSheetState().biome')=='lago'
  times=p.evaluate("""async()=>{const r=__r;if(!r.recoverJourneyColor())return null;const t0=performance.now(),out=[];let front=0;
   while(performance.now()-t0<3400){await new Promise(f=>requestAnimationFrame(f));const s=r.worldSheetState();out.push([performance.now()-t0,s.grey]);if(s.front)front=Math.max(front,s.front.r/s.front.reach);}return {out,front};}""")
  assert times,'recovered';reach=next(t for t,g in times['out'] if g<=.05);assert reach>=2000,('grey 1 → 0,05 in ≥ 2 s',reach,times['out'][:5])
  assert times['front']>.85,('the colour opens from the cube to the edge',times['front'])
  p.wait_for_timeout(600);p.evaluate(HIDE);st=p.evaluate(PIXELS,['w',[]])
  assert max(st['median'])<20,('a black ground',st)
  assert st['chroma']>.02,('the colour on the shapes',st)
  assert not errors,errors;p.close()
  # 3. The recording pill: white with a dot that blinks.
  p,errors=page(b,'?anillo=1')
  pill=p.evaluate("()=>{const e=document.getElementById('recBadge');e.hidden=false;const s=getComputedStyle(e),d=getComputedStyle(e.querySelector('.rec-dot'));return {color:s.color,border:s.borderColor,dot:d.backgroundColor,anim:d.animationName,text:e.textContent};}")
  assert pill['color']=='rgb(255, 255, 255)' and pill['dot']=='rgb(255, 255, 255)' and pill['anim']=='recblink' and '●' not in pill['text'],pill
  assert not errors,errors;p.close()
  b.close()
 print('PASS colour earned (P7): complete places in their own colour on the portals and the map (%d hues), gold only for stars; the chapter mark in its colour; the colour comes back in %.1f s from the cube and stays on the shapes (median %s, %.1f %% chroma); colour-blind portals all different; a white recording pill with a blinking dot'%(len(hues),reach/1000,st['median'],st['chroma']*100),flush=True)
finally:srv.shutdown();srv.server_close()
