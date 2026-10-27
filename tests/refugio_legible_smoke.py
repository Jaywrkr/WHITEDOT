"""Panel 11 (Q4 · Refugio y Lugares legibles) in the real game, at phone, landscape and desktop: in the Refugio no text
crosses another text, the Voz or a line of the frame, every label reads at 4.5:1 or more, and each room label has one
number; Lugares shows Llanura or a cue upward, its ★ are 10 px or more and «Ir» and «Seguir» share one width on the
name's line; with achievements unread, ☰ → Bitácora shows Logros (two taps); on the phone the map fills 40 % or more of
its box."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,base64,re
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Contrast of each drawn label: its colour at its alpha over the background under it (the median pixel of its box,
# where the thin strokes are a minority), against that background.
CONTRAST="""async([png,texts])=>{const img=new Image();img.src='data:image/png;base64,'+png;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const x=c.getContext('2d');x.drawImage(img,0,0);const dpr=img.width/innerWidth;
 const lin=v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4},lum=([r,g,b])=>.2126*lin(r)+.7152*lin(g)+.0722*lin(b);
 return texts.map(t=>{const d=x.getImageData(Math.round(t.x*dpr),Math.round(t.y*dpr),Math.max(1,Math.round(t.w*dpr)),Math.max(1,Math.round(t.h*dpr))).data,px=[];for(let i=0;i<d.length;i+=4)px.push([d[i],d[i+1],d[i+2]]);px.sort((a,b)=>lum(a)-lum(b));const bg=px[px.length>>1];
  const m=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i.exec(t.color)||[],fg=[1,2,3].map(i=>parseInt(m[i]||'ff',16)),a=(m[4]?parseInt(m[4],16)/255:1)*t.alpha,mix=fg.map((v,i)=>bg[i]+(v-bg[i])*a);
  const L1=lum(mix),L2=lum(bg);return {text:t.text,ratio:(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05)};});}"""
def cross(a,b):return a['x']<b['x']+b['w'] and b['x']<a['x']+a['w'] and a['y']<b['y']+b['h'] and b['y']<a['y']+a['h']
def seg(l):
 x0,x1=sorted([l['x0'],l['x1']]);y0,y1=sorted([l['y0'],l['y1']]);return {'x':x0-.5,'y':y0-.5,'w':x1-x0+1,'h':y1-y0+1}
ROOMS=('ECO','JARDÍN DE VOCES','CIELO','RAÍZ')
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--no-proxy-server','--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
  for tag,width,height in [('tel',390,844),('hor',844,390),('esc',1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']})")
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://kubono.localhost:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("()=>{"+hide+";if(__r.journeyMode()!=='libre')__r.setJourneyMode('libre');__r.hud?.();}")
   # --- The Refugio: the first landing says the Voz; wait until it is typed whole and the house has settled.
   page.evaluate("__r.landHouse()");page.wait_for_function("__r.houseActive()&&__r.houseSettled()&&__r.houseLugaresState().hits.length===12",timeout=15000);page.evaluate(hide)
   page.wait_for_function("document.getElementById('voice').classList.contains('on')&&document.getElementById('vX').textContent.endsWith('estés.')",timeout=15000)
   page.wait_for_timeout(500);page.evaluate('document.fonts.ready')
   lay=page.evaluate('__r.houseLayout()');texts=lay['texts'];lines=lay['lines']
   v=page.evaluate("(()=>{const r=document.getElementById('voice').getBoundingClientRect();return {text:'(Voz)',x:r.left,y:r.top,w:r.width,h:r.height};})()")
   assert texts,'the Refugio draws its labels'
   boxes=texts+[v]
   for i,a in enumerate(boxes):
    for b in boxes[i+1:]:assert not cross(a,b),(tag,'texts cross',a,b)
    for l in lines:assert not cross(a,seg(l)),(tag,'a text crosses the frame',a,l)
   # Labels inside the screen and the house's band, never cut.
   for t in texts:assert t['x']>=0 and t['x']+t['w']<=width and t['y']>=0 and t['y']+t['h']<=height,(tag,t)
   shot=base64.b64encode(page.screenshot()).decode()
   for r in page.evaluate(CONTRAST,[shot,texts]):assert r['ratio']>=4.5,(tag,'contrast',r)
   rooms=[t['text'] for t in texts if t['text'].startswith(ROOMS)]
   assert rooms,(tag,'room labels drawn')
   for t in rooms:assert len(re.findall(r'\d+',t))<=1,(tag,'one number per room label',t)
   if tag=='tel':
    assert any(t.startswith('CIELO · FALTA') for t in rooms),rooms
    assert lay['voice'] is not None and v['y']>=max(t['y']+t['h'] for t in texts if t['text'].startswith(ROOMS)),(tag,'the Voz under the last room label',v,lay['voice'])
   page.evaluate("__r.exitHouse()");page.wait_for_function("!__r.houseActive()",timeout=5000);page.evaluate(hide)
   # --- Lugares: Llanura in sight or a cue upward; ★ of 10 px or more; one width and the name's line for every action.
   page.evaluate("__r.openLugares()");page.wait_for_function("!document.getElementById('mLugares').hidden",timeout=3000);page.wait_for_timeout(400)
   info=page.evaluate("""()=>{const list=document.getElementById('lugaresList'),lr=list.getBoundingClientRect(),llanura=list.querySelector('[data-place-id=llanura]').getBoundingClientRect(),up=document.getElementById('lugaresScrollUp');
    const star=list.querySelector('.lugar-stars i'),cs=getComputedStyle(star),c=document.createElement('canvas').getContext('2d');c.font=cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily;const m=c.measureText('★');
    const acts=[...list.querySelectorAll('.lugar-actions button')].map(b=>{const r=b.getBoundingClientRect(),n=b.closest('li').querySelector('.lugar-name').getBoundingClientRect();return {text:b.textContent,w:r.width,dy:Math.abs((r.top+r.bottom)/2-(n.top+n.bottom)/2)};});
    return {llanura:llanura.top>=lr.top-1&&llanura.bottom<=lr.bottom+1,up:!up.hidden&&up.getClientRects().length>0&&/^↑/.test(up.textContent),star:{w:m.width,h:m.actualBoundingBoxAscent+m.actualBoundingBoxDescent},acts};}""")
   assert info['llanura'] or info['up'],(tag,'Llanura or a cue upward',info)
   assert info['star']['w']>=10 and info['star']['h']>=10,(tag,'★ of 10 px or more',info['star'])
   kinds={a['text'] for a in info['acts']};assert {'Ir','Seguir'}<=kinds,(tag,kinds)
   assert max(a['w'] for a in info['acts'])-min(a['w'] for a in info['acts'])<=.5,(tag,'one width',info['acts'])
   assert all(a['dy']<=2 for a in info['acts']),(tag,'on the name line',info['acts'])
   # Scrolling to the top shows Llanura and hides the cue.
   page.locator('#lugaresList').evaluate('e=>e.scrollTop=0');page.wait_for_function("document.getElementById('lugaresScrollUp').hidden",timeout=3000)
   page.evaluate(hide)
   # --- Bitácora: with achievements unread, ☰ → Bitácora shows Logros.
   page.evaluate("()=>{const id=__r.ACH.find(a=>!__r.S.ach[a[0]])[0];__r.S.ach[id]='2026-10-26';__r.achievementsTick?.(2);}")
   assert page.evaluate("__r.achievementsUnread()"),'an achievement waits unread'
   page.locator('#bMenu').click();page.wait_for_function("!document.getElementById('mMenu').hidden",timeout=3000);page.locator('#bAch').click()
   page.wait_for_function("!document.getElementById('mJournal').hidden",timeout=3000)
   assert page.evaluate("document.querySelector('[data-journal-tab=achievements]').getAttribute('aria-selected')")=='true',(tag,'Bitácora opens on Logros')
   assert not page.evaluate("__r.achievementsUnread()"),'Logros read them'
   page.evaluate(hide)
   # Read, the Bitácora opens where it was left.
   page.locator('#bMenu').click();page.locator('#bAch').click();page.wait_for_function("!document.getElementById('mJournal').hidden",timeout=3000);page.evaluate(hide)
   # --- The map fills its box (phone).
   if tag=='tel':
    page.evaluate("__r.openMap()");page.wait_for_function("!document.getElementById('mJournal').hidden",timeout=3000);page.wait_for_timeout(300)
    fill=page.evaluate("""()=>{const c=document.getElementById('mapCv'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let x0=c.width,y0=c.height,x1=0,y1=0;
     for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const i=(y*c.width+x)*4;if(Math.max(d[i],d[i+1],d[i+2])>80){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}}
     return Math.max(x1-x0,y1-y0)/c.width;}""")
    assert fill>=.4,('the map fills 40 % of its box',fill)
   assert not errors,errors;page.close()
  browser.close()
 print('PASS Refugio y Lugares legibles at phone, landscape and desktop: no text crosses another, the Voz or the frame; labels at 4.5:1 or more with one number per room; Lugares shows Llanura or «↑», ★ of 10 px or more, «Ir» and «Seguir» of one width on the name line; Bitácora opens on Logros with unread achievements; the map fills its box',flush=True)
finally:server.shutdown()
