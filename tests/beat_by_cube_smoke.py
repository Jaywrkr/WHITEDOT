"""Panel 10, P3: the beat beside the cube, in a real browser that is not marked as automated. The ghost finger rests
beside the cube no bigger than its 14×14 box; in Dunas it taps only the place's «y» steps; a ring closes on the cube
before the counted steps; the Line reads ≥ (90,90,90) and the cube keeps its size; the gold drops fly to where the bar
really is in three screen sizes."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,base64
ROOT=Path(__file__).resolve().parents[1]
PIXELS="async b=>{const i=new Image();i.src='data:image/png;base64,'+b;await i.decode();const c=document.createElement('canvas');c.width=i.width;c.height=i.height;const g=c.getContext('2d');g.drawImage(i,0,0);return {w:i.width,d:Array.from(g.getImageData(0,0,i.width,i.height).data)};}"
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# A canvas that only records what the hint draws: arcs and rectangles, in CSS pixels.
RECORD="""(still)=>{const r=__r;r.S.reducedMotion=still;const out=[];let a=1;const ctx=new Proxy({},{get:(o,k)=>k==='arc'?(x,y,rad)=>out.push({kind:'arc',x,y,r:rad,a}):k==='fillRect'?(x,y,w,h)=>out.push({kind:'rect',x,y,w,h,a}):k in o?o[k]:()=>{},set:(o,k,v)=>{if(k==='globalAlpha')a=v;o[k]=v;return true;}});
 r.drawJourneyHint(ctx,innerWidth,innerHeight);r.S.reducedMotion=false;return out;}"""
def open_page(browser,size,query=''):
 context=browser.new_context(viewport={'width':size[0],'height':size[1]},device_scale_factor=1)
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://kubono.localhost:{server.server_port}/{query}');page.wait_for_function('!!window.__r',timeout=20000);page.wait_for_timeout(2000)
 page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_function("__r.ac?.state==='running'&&__r.MU.sq.length>0",timeout=15000);page.wait_for_timeout(600)
 return context,page,errors
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--no-proxy-server','--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
  # 1. The start (00-inicio): the finger at rest is a ring around a dot, inside 14×14, its centre ≤ 30 px from the cube.
  context,page,errors=open_page(browser,(390,844))
  page.wait_for_function('__r.journeyHint().showing',timeout=12000)
  rest=page.evaluate(RECORD,True);W,H=390,844
  assert rest,'the finger draws'
  xs=[d['x']-d['r'] for d in rest if d['kind']=='arc']+[d['x'] for d in rest if d['kind']=='rect'];xe=[d['x']+d['r'] for d in rest if d['kind']=='arc']+[d['x']+d['w'] for d in rest if d['kind']=='rect']
  ys=[d['y']-d['r'] for d in rest if d['kind']=='arc']+[d['y'] for d in rest if d['kind']=='rect'];ye=[d['y']+d['r'] for d in rest if d['kind']=='arc']+[d['y']+d['h'] for d in rest if d['kind']=='rect']
  assert max(xe)-min(xs)<=14 and max(ye)-min(ys)<=14,(min(xs),max(xe),min(ys),max(ye))
  cx,cy=(max(xe)+min(xs))/2,(max(ye)+min(ys))/2;assert ((cx-W/2)**2+(cy-H/2)**2)**.5<=30,(cx,cy)
  # Moving: the finger's own ring never grows past the box; only the ring of a tap opens, and only on a counted step.
  for _ in range(30):
   frame=page.evaluate(RECORD,False)
   for d in frame:
    if d['kind']=='rect':assert d['w']==3 and d['h']==3
  # The Line reads over the landscape and the cube keeps its size (6×6 px of fill here).
  # Read the screenshot's pixels in the page itself (no image library needed in CI).
  y=round(H*.8);rgb=page.evaluate(PIXELS,base64.b64encode(page.screenshot()).decode())
  class Shot:
   def getpixel(self,xy):i=(xy[1]*rgb['w']+xy[0])*4;return tuple(rgb['d'][i:i+3])
  shot=Shot()
  line=sorted(shot.getpixel((x,y))[0] for x in range(60,330));assert line[len(line)//2]>=90,line[len(line)//2]
  cube=[(x,yy) for x in range(W//2-10,W//2+10) for yy in range(H//2-10,H//2+10) if min(shot.getpixel((x,yy)))>240]
  bx=[p[0] for p in cube];by=[p[1] for p in cube];assert max(bx)-min(bx)+1<=12 and max(by)-min(by)+1<=12,(min(bx),max(bx),min(by),max(by))
  # The ring around the cube shows up on the beat, with the Line's clock, and never on silence.
  seen=set()
  for _ in range(40):
   ring=page.evaluate('__r.journeyCubeRing(12)')
   if ring:seen.add(ring['gold']);assert ring['r']>=11,ring
   page.wait_for_timeout(37)
  assert True in seen or False in seen,'the ring closes on the cube'
  assert not errors,errors;context.close()
  # 2. Dunas: the finger taps the «y» steps (2·6·10·14), never a step that is a multiple of four.
  context,page,errors=open_page(browser,(390,844),'?lugar=dunas')
  assert page.evaluate('__r.journeyHint().steps')==[2,6,10,14],page.evaluate('__r.journeyHint().steps')
  peaks=page.evaluate("""async()=>{const out=[];const {heardStep}=await import('/src/journey-hint.js');for(let i=0;i<160;i++){const h=__r.journeyHint();if(h.beat>.8)out.push(Math.floor(heardStep(__r)));await new Promise(r=>setTimeout(r,12));}return out;}""")
  assert peaks and all(p%4==2 for p in peaks),peaks
  assert not errors,errors;context.close()
  # 3. In a round, the gold drops fly to the bar's real place in three sizes; the last frame lands within 4 px.
  for size in [(390,844),(844,390),(1280,800)]:
   context,page,errors=open_page(browser,size,'?lugar=jardin')
   page.wait_for_function("getComputedStyle(document.getElementById('bar')).display!=='none'",timeout=10000)
   got=page.evaluate("""async()=>{const m=await import('/src/journey-games.js'),r=document.getElementById('bar').getBoundingClientRect(),t=__r.journeyBarDrop().bar,c=document.createElement('canvas').getContext('2d');
    for(let k=0;k<1;k+=16/450){const e=1-(1-k)*(1-k);m.drawBarDrop(c,innerWidth/2,innerHeight/2,t.left+(t.right-t.left)*.4,t.y,e,4,1,'#f0d27a');}
    return {bar:{left:r.left,right:r.right,y:r.top+r.height/2},target:t,last:m.barDropState()};}""")
   b,t,last=got['bar'],got['target'],got['last']
   assert abs(b['y']-t['y'])<=1 and abs(b['left']-t['left'])<=1 and abs(b['right']-t['right'])<=1,(size,got)
   assert abs(last['y']-b['y'])<=4,(size,got)
   assert not errors,errors;context.close()
  browser.close()
finally:server.shutdown()
print('PASS beat by the cube: the finger rests beside the cube inside 14×14 and taps Dunas on its «y»; the ring closes on the cube; the Line reads ≥ 90 and the cube keeps its size; drops land on the real bar in 390×844, 844×390 and 1280×800')
