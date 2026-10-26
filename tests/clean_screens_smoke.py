"""Panel 10 · P1: clean screens. Whole words, whole rows, even button rows and a quiet opening focus,
on phone, landscape and desktop."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
SIZES=[(390,844),(844,390),(1280,800)]
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true)"
# Lines a text node takes: distinct tops of its client rects.
LINES="e=>{const r=document.createRange();r.selectNodeContents(e);return new Set([...r.getClientRects()].map(x=>Math.round(x.top))).size}"
# Buttons of each visible row, grouped by their top edge: heights in one line must match.
ROWS="""sel=>{const out=[];for(const row of document.querySelectorAll(sel)){const lines=new Map();for(const b of row.querySelectorAll(':scope>button')){const r=b.getBoundingClientRect();if(!r.width)continue;const k=Math.round(r.top);(lines.get(k)||lines.set(k,[]).get(k)).push(r.height);}
 for(const hs of lines.values())out.push(Math.max(...hs)-Math.min(...hs));}return out}"""
def page(b,w,h,query='?anillo=1'):
 p=b.new_page(viewport={'width':w,'height':h});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{srv.server_port}/{query}');p.wait_for_function('!!window.__r?.openLugares');p.wait_for_timeout(2500);p.evaluate(HIDE);return p,errors
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for w,h in SIZES:
   p,errors=page(b,w,h)
   # Settings: the version and «Copiar diagnóstico» stay whole, each on one line.
   p.evaluate("document.getElementById('mSettings').hidden=false");p.wait_for_timeout(100)
   assert p.locator('#releaseVersion').evaluate(LINES)==1,(w,h,'version split')
   assert p.locator('#diagnosticCopy').evaluate(LINES)==1,(w,h,'diagnostic split')
   assert p.locator('#diagnosticCopy').evaluate("e=>getComputedStyle(e).overflowWrap")!='anywhere'
   p.evaluate(HIDE)
   # Lugares opens on whole rows: every row is fully inside the list or fully outside it.
   p.evaluate('__r.openLugares()');p.wait_for_timeout(300)
   cut=p.evaluate("""()=>{const l=document.getElementById('lugaresList'),r=l.getBoundingClientRect(),top=r.top+l.clientTop,bottom=top+l.clientHeight;
     return [...l.children].map(li=>li.getBoundingClientRect()).filter(x=>x.bottom>top+1&&x.top<bottom-1&&(x.top<top-1||x.bottom>bottom+1)).length}""")
   assert cut==0,(w,h,'a row opens cut',cut)
   assert p.evaluate("document.querySelector('#lugaresList [aria-current=step]').getBoundingClientRect().top>=document.getElementById('lugaresList').getBoundingClientRect().top-1")
   line=p.locator('#lugaresRemixLine')
   if line.is_visible():assert line.locator('span').evaluate(LINES)==1,(w,h,'remix quote split')
   assert max(p.evaluate(ROWS,'#mLugares .row'))<=1,(w,h,'Lugares buttons differ in height')
   p.evaluate(HIDE)
   # The guide's button rows: one height per line; the way on leads, full width.
   p.evaluate("document.getElementById('bGuide').click()");p.wait_for_timeout(300)
   assert max(p.evaluate(ROWS,'#mGuide .row'))<=1,(w,h,'guide buttons differ in height')
   if p.locator('#guideFollow').is_visible():
    row=p.evaluate("()=>{const f=document.getElementById('guideFollow').getBoundingClientRect(),r=f.width,o=[...document.querySelectorAll('#mGuide .row>button')].filter(x=>x.offsetParent).map(x=>x.getBoundingClientRect());return {wide:Math.max(...o.map(x=>x.width)),first:Math.min(...o.map(x=>x.top)),f:{w:r,top:f.top}}}")
    assert row['f']['w']>=row['wide']-1 and row['f']['top']<=row['first']+1,row
   p.evaluate(HIDE)
   # Tu canción: the opening focus is the hidden title, not «Otra vez».
   p.evaluate("()=>{__r.S.lugares.stars.lago=[true,false,false];__r.openSong()}");p.wait_for_function('document.getElementById("songStage").contains(document.activeElement)')
   assert p.evaluate("document.activeElement.tagName")=='H2' and p.evaluate("!document.activeElement.matches('button')")
   p.locator('#songClose').click()
   # The result sheet: equal heights in each line; «Seguir» alone on its own line.
   p.evaluate("""()=>{const r=__r;r.startPlace?.('lago');for(let i=0;i<500;i++)r.placeHear('lago',i<373,{});const real=Date.now,now=real();r.S.lugares.run.startedAt=now-59999;Date.now=()=>now;try{r.placeFinish('lago');}finally{Date.now=real;}}""")
   p.wait_for_function("!document.getElementById('mPlace').hidden");p.wait_for_timeout(200)
   assert max(p.evaluate(ROWS,'#mPlace .row'))<=1,(w,h,'result buttons differ in height')
   if p.locator('#placeNext').is_visible():
    # Panel 10 (P4): at 74,6 % (near ★★) «Otra vez» stands beside «Seguir hacia»; nothing else shares its line.
    beside=p.evaluate("()=>{const n=document.getElementById('placeNext').getBoundingClientRect();return [...document.querySelectorAll('#mPlace .row>button')].filter(x=>x.offsetParent&&x.id!=='placeNext'&&Math.abs(x.getBoundingClientRect().top-n.top)<=2).map(x=>x.id)}")
    assert beside==['placeAgain'],(w,h,beside,'near ★★: only «Otra vez» beside «Seguir»')
    assert p.evaluate("document.getElementById('placeNext').scrollHeight<=document.getElementById('placeNext').clientHeight+1"),(w,h,'Seguir fits')
   assert not errors,errors;p.close()
  # Menu in landscape: nothing of the sheet shows above its sticky heading.
  p,errors=page(b,844,390)
  p.evaluate("document.getElementById('bMenu').click()");p.wait_for_timeout(300);p.evaluate("document.getElementById('menuMore')?.setAttribute('open','')")
  p.evaluate("document.querySelector('#mMenu .sheet').scrollTop=1e5");p.wait_for_timeout(200)
  gap=p.evaluate("()=>{const s=document.querySelector('#mMenu .sheet'),hd=s.querySelector('.menu-heading');return hd.getBoundingClientRect().top-(s.getBoundingClientRect().top+s.clientTop)}")
  assert gap<=0.5,('menu heading leaves a strip above it',gap)
  # Desktop: the sheet's foot fades while more lies below, and adds no scroll of its own.
  p.set_viewport_size({'width':1280,'height':800});p.wait_for_timeout(200)
  fade=p.evaluate("getComputedStyle(document.querySelector('#mMenu .sheet'),'::after').backgroundImage")
  assert 'gradient' in fade,fade
  p.evaluate(HIDE)
  # A sample card outside the laboratory shows its tier, never «Laboratorio» nor a code.
  p.evaluate("()=>{const r=__r;r.collectRareCard('fossil',{id:'clean:fixture:0',x:r.S.wx,y:r.S.wy},{forced:true});r.openJournal('rares');}");p.wait_for_timeout(300)
  head=p.locator('.rare-card header').first
  assert 'laboratorio' not in head.inner_text().lower() and head.locator('small').count()==0,head.inner_text()
  p.evaluate(HIDE)
  # The map legend: items, no separator hanging at a line end, a breath before the buttons.
  p.evaluate("()=>{document.getElementById('bMenu').click();document.getElementById('menuMore')?.setAttribute('open','');document.getElementById('bMap').click()}");p.wait_for_timeout(400)
  # Panel 10 (P8): no counter at zero in the legend.
  spans=p.locator('#mapNote span').all_text_contents();assert spans and not any(t.startswith('0 ') for t in spans),spans
  assert '·' not in p.locator('#mapNote').inner_text()
  assert p.evaluate("parseFloat(getComputedStyle(document.getElementById('mapNote')).marginBottom)")>=16
  assert not errors,errors;p.close()
  # The Refugio: in landscape the house keeps to the band left of its panel; the Voice speaks below y=120.
  for w,h in SIZES:
   p,errors=page(b,w,h);p.evaluate('__r.landHouse()');p.wait_for_function('__r.houseSettled()')
   g=p.evaluate("()=>{const v=__r.houseGeometry(),panel=document.getElementById('housePanel').getBoundingClientRect(),west=__r.houseToScreen(0,0).x;return {W:v.W,panelLeft:panel.left,panelTop:panel.top,side:panel.left>innerWidth/2,width:innerWidth}}")
   if g['side']:assert g['W']<=g['panelLeft']-7,g
   else:assert g['W']==g['width'],g
   p.evaluate("__r.say('Tu Refugio viaja contigo. Se abre donde estés.','Voz',{requested:true})")
   try:p.wait_for_function("document.getElementById('voice').classList.contains('on')",timeout=4000)
   except Exception:pass
   if p.evaluate("document.getElementById('voice').classList.contains('on')"):
    p.wait_for_timeout(400);r=p.evaluate("document.getElementById('voice').getBoundingClientRect().toJSON()")
    assert r['top']>=120,(w,h,r)
    if g['side']:assert r['left']>=g['panelLeft']-1 and r['bottom']<=g['panelTop'],(r,g)
   assert not errors,errors;p.close()
  b.close()
finally:srv.shutdown();srv.server_close()
print('ok')
