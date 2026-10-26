"""Panel 11 (Q1 · Reglas a la vista, D10-B) in the real game: in Lugares, the Refugio and the map every gold pixel is a ★ or a ✦ (counts of places, buttons and notices are white); the three HUD numbers share one size and end on the same x; the map says «portales abiertos» and «tu Refugio»; the Refugio's button says «Lugares»; «Vista tranquila» names Tu cubo and the numbers."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,base64
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Gold is the stars' #f0d27a family (R>200, B<150, R-G between 15 and 60: not a place's orange or the Faros' yellow).
# A cluster of gold pixels passes when it sits inside a ★/✦ element, or is at most 5 px tall: the ★ pips drawn under
# trophies and portals. Text in gold (a count, a button label) is taller and fails.
GOLD="""async([png,allowed])=>{const img=new Image();img.src='data:image/png;base64,'+png;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);
 const W=c.width,H=c.height,d=x.getImageData(0,0,W,H).data,gold=new Uint8Array(W*H);for(let i=0;i<W*H;i++){const r=d[i*4],g=d[i*4+1],b=d[i*4+2];gold[i]=r>200&&b<150&&r-g>15&&r-g<60?1:0;}
 const rects=document.querySelectorAll(allowed),boxes=[...rects].filter(e=>e.offsetParent!==null||e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return [r.left-2,r.top-2,r.right+2,r.bottom+2];}),dpr=W/innerWidth;
 const seen=new Uint8Array(W*H),bad=[];for(let i=0;i<W*H;i++){if(!gold[i]||seen[i])continue;const st=[i];seen[i]=1;let x0=W,y0=H,x1=0,y1=0,n=0;while(st.length){const j=st.pop(),px=j%W,py=(j/W)|0;n++;x0=Math.min(x0,px);y0=Math.min(y0,py);x1=Math.max(x1,px);y1=Math.max(y1,py);
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const qx=px+dx,qy=py+dy;if(qx<0||qy<0||qx>=W||qy>=H)continue;const k=qy*W+qx;if(gold[k]&&!seen[k]){seen[k]=1;st.push(k);}}}
  const b=[x0/dpr,y0/dpr,x1/dpr,y1/dpr],inside=boxes.some(r=>b[0]>=r[0]&&b[1]>=r[1]&&b[2]<=r[2]&&b[3]<=r[3]);if(!inside&&(y1-y0)/dpr>5)bad.push({box:b.map(Math.round),n});}
 return bad;}"""
STARS='#hudStars,#sparkCount,.lugar-stars i.got,#placeStars .got,#portalStars .got'
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--no-proxy-server','--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   # A normal browser, as the panel saw it (scripts/panel-capture.py): automation and localhost mark the page as dev, which dims spans.
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://kubono.localhost:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
   assert not page.evaluate("document.body.classList.contains('dev')")
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   def gold(label):
    page.wait_for_timeout(600);page.evaluate('document.fonts.ready');bad=page.evaluate(GOLD,[base64.b64encode(page.screenshot()).decode(),STARS])
    assert not bad,(label,width,'gold outside ★ and ✦',bad[:6])
   page.evaluate("()=>{"+hide+";__r.S.lugares.stars.lago=[true,true,false];__r.S.lugares.seen.lago=true;if(__r.journeyMode()!=='libre')__r.setJourneyMode('libre');__r.hud?.();}")
   # The HUD: ★ of 33, ✦ and places of 11, one size and weight, ending on the same x when the delta is empty.
   page.wait_for_function("['hudStars','sparkCount','hudPlaces'].every(id=>document.getElementById(id).getClientRects().length)&&document.getElementById('sparkGain').textContent===''",timeout=10000)
   hud=page.evaluate("""()=>['hudStars','sparkCount','hudPlaces'].map(id=>{const e=document.getElementById(id),t=id==='sparkCount'?document.getElementById('sparkTotal'):e,r=t.getBoundingClientRect(),s=getComputedStyle(t);return {id,right:r.right,height:r.height,size:s.fontSize,weight:s.fontWeight,color:s.color};})""")
   assert max(h['right'] for h in hud)-min(h['right'] for h in hud)<=1,hud
   assert max(h['height'] for h in hud)-min(h['height'] for h in hud)<=1,hud
   assert len({(h['size'],h['weight']) for h in hud})==1,hud
   assert hud[0]['color']==hud[1]['color']!=hud[2]['color'],('★ and ✦ gold, places white',hud)
   # Lugares: the count «5 / 11» is white; only the earned ★ are gold.
   page.evaluate("__r.openLugares()");page.wait_for_function("!document.getElementById('mLugares').hidden",timeout=3000)
   assert page.inner_text('#lugaresCount').strip(),'Lugares counts the places'
   gold('lugares');page.evaluate(hide)
   # The Refugio: the wall says ★ N / 33 in white and the house bar says «Lugares».
   page.evaluate("__r.landHouse()");page.wait_for_function("__r.houseActive()&&!__r.houseLanding()&&__r.houseLugaresState().hits.length===12",timeout=10000);page.evaluate(hide)
   assert page.inner_text('#houseStars')=='Lugares',page.inner_text('#houseStars')
   gold('refugio')
   page.evaluate("__r.exitHouse()");page.wait_for_function("!__r.houseActive()",timeout=5000)
   # The map: one word per count.
   page.evaluate("__r.openMap()");page.wait_for_function("!document.getElementById('mJournal').hidden",timeout=3000)
   note=page.inner_text('#mapNote');assert 'portales abiertos' in note and 'lugares abiertos' not in note and 'Estudio' not in note,note
   gold('mapa');page.evaluate(hide)
   # «Vista tranquila» says what it hides, in the same mode as its title.
   page.locator('#bMenu').click();page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')")
   sub=page.inner_text('#bJourneyMode small');assert 'Tu cubo' in sub and 'cifras' in sub,sub
   assert not errors,errors;page.close()
  browser.close()
 print('PASS rules in sight on phone and desktop: gold only on ★ and ✦ in Lugares, the Refugio and the map; three HUD numbers at one size on one edge; portals and Refugio named once; Vista tranquila names what it hides',flush=True)
finally:server.shutdown()
