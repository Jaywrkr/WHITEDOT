"""Jay's fixes after alpha.231 (28 Oct 2026, alpha.232), on a 390×844 phone.
G1 · the end of a round: after the drop the screen goes black and the sheet with the stars opens over it; nothing of the
World shows or answers behind it; touching the black does not close it; ★ in gold only for what is won; one white button;
«Seguir hacia …» and «Otra vez» carry on (with no next place on the path, «Otra vez» is the white one).
G2 · «Paseo musical» (#bAuto, and its twin in Favoritos) is in no view or menu; the autopilot still starts by code."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
SHOTS=Path(os.environ.get('KUBONO_SHOTS','/tmp'))
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
# Every point of the screen belongs to the sheet's black layer: nothing of the World or the HUD shows through or on top.
COVER="""()=>{const m=document.getElementById('mPlace'),out=[];for(let x=5;x<390;x+=35)for(let y=5;y<844;y+=40){const e=document.elementFromPoint(x,y);if(!e||!m.contains(e))out.push([x,y,e&&(e.id||e.className||e.tagName)]);}return out;}"""
SHEET="""()=>{const m=document.getElementById('mPlace'),cs=getComputedStyle(m),btns=[...m.querySelectorAll('.row button')].filter(b=>b.getClientRects().length&&getComputedStyle(b).display!=='none');
 return {bg:cs.backgroundColor,white:btns.filter(b=>getComputedStyle(b).backgroundColor==='rgb(255, 255, 255)').map(b=>b.id),buttons:btns.map(b=>b.id),
  stars:[...document.querySelectorAll('#placeStars span')].map(s=>({got:s.classList.contains('got'),color:getComputedStyle(s).color,size:s.getBoundingClientRect().height}))};}"""
def page_for(b,url):
 p=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.add_init_script("Object.defineProperty(navigator,'languages',{get:()=>['es-ES']});")
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{server.server_port}/{url}');return p,errors
def finish(p,place,hits,total=100):
 p.wait_for_function("!__r.rhythmDemo()",timeout=20000)
 p.evaluate("([id,h,t])=>{for(let i=0;i<t;i++)__r.placeHear(id,i<h,{});__r.placeFinish(id);}",[place,hits,total])
 p.wait_for_function('!document.getElementById("mPlace").hidden',timeout=15000);p.wait_for_timeout(900)
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  # G1 · a Lago round with sound, ★★: the card after the drop, on black.
  p,errors=page_for(b,'?lugar=lago');p.wait_for_function('__r?.placeRun()?.id==="lago"',timeout=20000)
  p.evaluate("()=>{"+HIDE+";__r.S.sound=true;__r.audio();}");p.wait_for_function("__r.ac?.state==='running'&&__r.MU?.sq?.length>0",timeout=20000)
  finish(p,'lago',84)
  s=p.evaluate(SHEET);assert s['bg']=='rgb(0, 0, 0)',s
  assert not p.evaluate(COVER),p.evaluate(COVER)
  assert s['white']==['placeNext'] and p.inner_text('#placeNext').startswith('Seguir hacia'),s
  got=[x for x in s['stars'] if x['got']];assert len(got)==2 and all(x['color']=='rgb(240, 210, 122)' for x in got),s['stars']
  assert all(x['color']!='rgb(240, 210, 122)' for x in s['stars'] if not x['got']) and min(x['size'] for x in s['stars'])>=24,s['stars']
  shot=SHOTS/'kubono-g1-fin-de-ronda-390.png';p.screenshot(path=str(shot))
  # Touching the black closes nothing, moves nothing and plays no pulse.
  pos=p.evaluate('[__r.S.wx,__r.S.wy]');p.mouse.click(30,30);p.touchscreen.tap(360,60);p.wait_for_timeout(600)
  assert p.locator('#mPlace').is_visible() and p.evaluate('[__r.S.wx,__r.S.wy]')==pos
  # Nothing comes over it: notices and the HUD wait behind the black.
  p.evaluate("__r.toast?.('Prueba encima',{level:2})");p.wait_for_timeout(300);assert not p.evaluate(COVER)
  # «Otra vez» carries on: a new round of the same place.
  p.locator('#placeAgain').click();p.wait_for_function('__r.placeRun()?.id==="lago"',timeout=5000);assert p.locator('#mPlace').is_hidden()
  # Again, and «Seguir hacia …» carries on to the next place: the card closes, the route points there.
  finish(p,'lago',84);nxt=p.evaluate('__r.placeNext()');p.locator('#placeNext').click();p.wait_for_timeout(300)
  assert p.locator('#mPlace').is_hidden() and p.evaluate('__r.placeRun()') is None and p.evaluate('__r.ringState?.().target||__r.ringRoute?.()?.id')==nxt,(nxt,p.evaluate('__r.ringState?.()'))
  assert not errors,errors;p.close()
  # G1 · with no next place on the path (the eleven won, the Jardín the only one short of ★★★), «Otra vez» is the white one.
  p,errors=page_for(b,'?lugar=jardin');p.wait_for_function('__r?.placeRun()?.id==="jardin"',timeout=20000)
  p.evaluate("()=>{"+HIDE+";const r=__r,d=r.placesData();for(const k of Object.keys(d.stars))d.stars[k]=[true,true,true];d.stars.jardin=[true,true,false];d.won=true;d.credited=true;r.S.elevenNote={version:1,seen:true};r.S.sound=false;r.save();}")
  finish(p,'jardin',50)
  s=p.evaluate(SHEET);assert p.locator('#placeNext').is_hidden() and s['white']==['placeAgain'] and s['bg']=='rgb(0, 0, 0)',s
  b1,b2=[p.locator(x).bounding_box() for x in ('#placeAgain','#placeClose')];assert b1['y']<b2['y'] and b1['width']>=b2['width']-1,(b1,b2)
  p.locator('#placeClose').click();p.wait_for_timeout(200);assert p.locator('#mPlace').is_hidden() and p.evaluate('__r.placeRun()') is None
  assert not errors,errors;p.close()
  # G2 · no «Paseo musical» in any view: the Camino, the World (also with the tools open), the menu with «Más» open,
  # Favoritos' tools and the quiet view. The autopilot still starts by code.
  p,errors=page_for(b,'');p.wait_for_function('!!window.__r',timeout=20000);p.wait_for_timeout(500)
  def gone(where):
   st=p.evaluate("()=>['bAuto','favWalk'].map(id=>{const e=document.getElementById(id);return [id,!!e,e&&getComputedStyle(e).display,e&&e.getClientRects().length]})")
   assert all(x[1] and x[2]=='none' and x[3]==0 for x in st),(where,st)
  gone('camino');p.close()
  p,errors=page_for(b,'?anillo=1');p.wait_for_function('!!window.__r?.ringState&&__r.inWorld()',timeout=20000);p.evaluate("()=>{"+HIDE+";__r.setJourneyMode?.('libre');}");p.wait_for_timeout(400);p.evaluate(HIDE)
  gone('world');dock=p.evaluate("[...document.querySelectorAll('#dock button')].filter(e=>e.getClientRects().length).map(e=>e.id)");assert 'bAuto' not in dock,dock
  p.screenshot(path=str(SHOTS/'kubono-g2-mundo-sin-paseo-390.png'))
  p.evaluate("document.body.classList.add('tools-open')");gone('tools open');p.evaluate("document.body.classList.remove('tools-open')")
  p.locator('#bMenu').click();p.evaluate("document.getElementById('menuMore')?.setAttribute('open','')");p.wait_for_timeout(100);gone('menu');p.locator('#mnClose').click()
  p.evaluate("()=>{__r.openFavorites?.();document.querySelectorAll('#mFavorites details').forEach(d=>d.open=true);}");p.wait_for_timeout(150);gone('favorites');p.evaluate(HIDE)
  p.evaluate("document.body.classList.add('journey-quiet')");gone('quiet');p.evaluate("document.body.classList.remove('journey-quiet')")
  assert p.evaluate("__r.startAutopilot('wander')") and p.evaluate('__r.autopilotState.mode')=='wander';p.evaluate('__r.stopAutopilot()')
  # The achievement that asked for it is retired: not listed unless already earned.
  assert p.evaluate("__r.achievementMeta(__r.ACH.find(a=>a[0]==='paseo1')).retired")
  assert not errors,errors;p.close()
  b.close()
 print('PASS arreglos G1–G2: round card on opaque black after the drop, nothing over or behind it, no close on the black, gold only on won ★, one white button that carries on («Seguir hacia» or «Otra vez»); no «Paseo musical» in any view, autopilot by code',flush=True)
finally:server.shutdown();server.server_close()
