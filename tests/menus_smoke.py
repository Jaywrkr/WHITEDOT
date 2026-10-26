"""Panel 10 · P2: menus. The frequent things first, in both views and at phone, landscape and desktop sizes:
two touches to go on, see the stars, open Lugares and open the Bitácora; three to the volume (and to the shop in the
full view). «Más» opens closed, the menu fits without scrolling, no section label is left empty, every visible menu
button does something, every bottom exit says «Cerrar» and the account says it is optional."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
SIZES=[(390,844),(844,390),(1280,800)]
# CI gives each flow 145 s: run alone this file checks the phone size; menus_*_smoke.py run the other parts. MENUS_PART=all runs everything.
PART=os.environ.get('MENUS_PART','size390')
want=lambda name:PART in ('all',name) or PART.startswith(name+'-half')
# A «-halfN» part takes every other visible button (N = 1 or 2) so the longest checks also fit.
half=lambda ids:ids[int(PART[-1])-1::2] if '-half' in PART else ids
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true)"
SHOWN="id=>{const e=document.getElementById(id);if(!e)return false;const r=e.getBoundingClientRect();return !e.hidden&&getComputedStyle(e).display!=='none'&&r.width>0&&r.height>0}"
# Whatever a menu button may change: an open sheet or panel, the place you are in, the view, a recording, a route.
STATE="""()=>{const r=__r;return JSON.stringify({open:[...document.querySelectorAll('.modal,#studioPanel,#housePanel,#seedEncounter,#recBadge')].filter(m=>!m.hidden&&m.id!=='mMenu').map(m=>m.id),
 mode:r.S.mode,view:r.journeyMode?.(),tools:document.body.classList.contains('tools-open'),house:!!r.houseActive?.(),round:!!r.placeRun?.(),
 target:JSON.stringify(r.navigationState?.target||null),guide:JSON.stringify(r.S.places?.guide||r.placesData?.()?.guide||null),wx:Math.round(r.S.wx||0),wy:Math.round(r.S.wy||0)})}"""
VISIBLE_MENU="""()=>[...document.querySelectorAll('#mMenu button')].filter(b=>{if(b.closest('.devbox')||b.id==='mnClose')return false;const r=b.getBoundingClientRect();return !b.hidden&&getComputedStyle(b).display!=='none'&&r.width>0&&r.height>0}).map(b=>b.id)"""
def page(b,w,h,view='libre',where='world'):
 p=b.new_page(viewport={'width':w,'height':h});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.openLugares&&!!window.__r?.tidyMenu');p.wait_for_timeout(2500);p.evaluate(HIDE)
 if p.evaluate('__r.journeyMode()')!=view:assert p.evaluate(f"__r.setJourneyMode('{view}')")
 if where=='camino':p.evaluate('__r.exitWorld(false)')
 p.evaluate(HIDE);p.wait_for_timeout(200);return p,errors
def menu(p,more=False):
 p.locator('#bMenu').click();p.wait_for_timeout(150)
 if more:p.locator('#menuMore > summary').click();p.wait_for_timeout(150)
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for w,h in SIZES:
   if not want(f'size{w}'):continue
   for view in ('libre','viaje'):
    p,errors=page(b,w,h,view)
    # «Más» opens closed every time, even when it was left open.
    menu(p,True);assert p.evaluate("document.getElementById('menuMore').open");p.locator('#mnClose').click();menu(p)
    assert not p.evaluate("document.getElementById('menuMore').open"),(w,h,view,'«Más» opens closed')
    # With «Más» closed the whole menu fits: no scrolling, and its last row is inside the screen.
    # (The «Prototipo» box shows only on development hosts and in automated browsers; players never see it.)
    fit=p.evaluate("(()=>{const dev=document.body.classList.contains('dev');document.body.classList.remove('dev');const s=document.querySelector('#mMenu .menu-sheet'),r=s.getBoundingClientRect(),out=[s.scrollHeight-s.clientHeight,r.bottom-innerHeight,r.top];document.body.classList.toggle('dev',dev);return out})()")
    assert fit[0]<=1 and fit[1]<=0 and fit[2]>=0,(w,h,view,'the menu scrolls or leaves the screen',fit)
    # Two touches: go on (☰ → Seguir), Lugares, Bitácora; Ajustes and Cómo jugar always in view.
    for id in ('bContinue','bLugares','bAch','bStudio','bSettings','bGuide'):assert p.evaluate(SHOWN,id),(w,h,view,id,'not in view')
    assert p.evaluate(SHOWN,'bCube')==(view=='libre'),(w,h,view,'Tu cubo in the full view only (no shop in the quiet view)')
    order=p.evaluate("[...document.querySelectorAll('.menu-group.primary .tiles>button')].filter(b=>getComputedStyle(b).display!=='none'&&!b.hidden).map(b=>b.id)")
    assert order==(['bContinue','bLugares','bCube','bStudio','bAch'] if view=='libre' else ['bContinue','bLugares','bStudio','bAch']),order
    # The first row closes its gaps: its tiles share the width and the height.
    tiles=p.evaluate("[...document.querySelectorAll('.menu-group.primary .tiles>button')].filter(b=>getComputedStyle(b).display!=='none'&&!b.hidden&&b.id!=='bContinue').map(b=>{const r=b.getBoundingClientRect();return [r.width,r.height,r.top]})")
    assert max(t[0] for t in tiles)-min(t[0] for t in tiles)<=1 and max(t[1] for t in tiles)-min(t[1] for t in tiles)<=1,(w,h,view,tiles)
    cont=p.evaluate("(()=>{const a=document.getElementById('bContinue').getBoundingClientRect(),s=[...document.querySelectorAll('.menu-group.primary .tiles>button')].filter(b=>getComputedStyle(b).display!=='none'&&!b.hidden).map(b=>b.getBoundingClientRect());return [a.left,a.right,Math.min(...s.map(r=>r.left)),Math.max(...s.map(r=>r.right))]})()")
    assert abs(cont[0]-cont[2])<=1 and abs(cont[1]-cont[3])<=1,(w,h,view,'tiles fill the row',cont)
    u=p.evaluate("['bSettings','bGuide'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return [r.top,r.width]})");assert abs(u[0][0]-u[1][0])<=1 and abs(u[0][1]-u[1][1])<=1,(w,h,view,'utilities share one row',u)
    # The header: ★ first and in gold in the full view; the quiet view shows no numbers.
    summary=p.locator('#menuSummary').inner_text()
    if view=='libre':
     assert summary.startswith('★ ') and '/33' in summary and '✦' in summary,summary
     gold=p.evaluate("getComputedStyle(document.querySelector('#menuSummary .menu-stars')).color");assert gold=='rgb(240, 210, 122)',gold
    else:assert '★' not in summary and '✦' not in summary,summary
    # Text in the menu is at least 12 px; every control is at least 44 px tall.
    small=p.evaluate("[...document.querySelectorAll('#mMenu .menu-sections *')].filter(e=>e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&e.getClientRects().length&&parseFloat(getComputedStyle(e).fontSize)<12).map(e=>e.id||e.className||e.tagName)")
    assert not small,(w,h,view,small)
    # «Más»: a label only above rows that show; labels say Ir, Crear and Tú.
    menu_open=p.locator('#menuMore > summary');menu_open.click();p.wait_for_timeout(150)
    empty=p.evaluate("""[...document.querySelectorAll('#menuMore .menu-section-label')].filter(l=>!l.hidden).filter(l=>{let n=l.nextElementSibling,seen=false;while(n&&!n.matches('.menu-section-label')){if(n.matches('button')&&!n.hidden&&getComputedStyle(n).display!=='none')seen=true;n=n.nextElementSibling;}return !seen}).map(l=>l.textContent)""")
    assert not empty,(w,h,view,'empty section label',empty)
    labels=p.evaluate("[...document.querySelectorAll('#menuMore .menu-section-label')].map(l=>l.textContent)");assert labels==['Ir','Crear','Tú'],labels
    low=p.evaluate("[...document.querySelectorAll('#mMenu .menu-sections button')].filter(b=>b.getClientRects().length&&getComputedStyle(b).display!=='none'&&b.getBoundingClientRect().height<44).map(b=>b.id)");assert not low,(w,h,view,low)
    # In the World, the way back to the Camino heads «Más › Ir»: one button for it, never in «Ayuda y cuenta».
    assert p.evaluate(SHOWN,'bPrimary') and not p.evaluate(SHOWN,'bWorld'),(w,h,view,'one way back')
    assert p.evaluate("document.getElementById('bPrimary').previousElementSibling.textContent")=='Ir'
    assert p.locator('#bPrimaryL').inner_text()=='Volver al Camino'
    p.locator('#mnClose').click()
    # Volume: ☰ → Ajustes → slider, first thing in Ajustes; «Más sonido» comes back to Ajustes.
    menu(p);p.locator('#bSettings').click();p.wait_for_timeout(150)
    first=p.evaluate("document.querySelector('#mSettings .settings-block input,#mSettings .settings-block button').id");assert first=='rMenuVolume',first
    blocks=p.evaluate("[...document.querySelectorAll('#mSettings .settings-block>h3')].map(e=>e.textContent)");assert blocks==['Sonido y tiempo','Ver y sentir','Partida'],blocks
    assert p.evaluate("(()=>{const t=[...document.querySelectorAll('#mSettings .settings-block:last-of-type button')].filter(b=>b.getClientRects().length);return t.at(-1).id})()")=='bStartOver','«Empezar de cero» last'
    p.locator('#rMenuVolume').fill('40');p.locator('#rMenuVolume').dispatch_event('change');assert p.evaluate('__r.S.outputVolume')==.4
    p.locator('#bMusicSettings').click();p.wait_for_timeout(150);assert p.locator('#rVolume').input_value()=='40'
    p.locator('#muClose').click();p.wait_for_timeout(150);assert p.locator('#mSettings').is_visible() and p.locator('#mMusic').is_hidden(),'Sound returns to Ajustes'
    p.locator('#bMusicSettings').click();p.wait_for_timeout(150);p.keyboard.press('Escape');p.wait_for_timeout(150);assert p.locator('#mSettings').is_visible(),'Escape returns to Ajustes too'
    p.locator('#settingsClose').click()
    # Lugares (two touches) shows the stars in both views; the shop is three in the full view.
    menu(p);p.locator('#bLugares').click();p.wait_for_timeout(300);assert p.locator('#mLugares').is_visible() and '★' in p.inner_text('#lugaresNext')
    p.locator('#lugaresClose').click();menu(p);p.locator('#bAch').click();p.wait_for_timeout(300);assert p.locator('#mJournal').is_visible()
    tabs=p.evaluate("[...document.querySelectorAll('[data-journal-tab]')].map(b=>[b.getAttribute('role'),b.getAttribute('aria-selected')])")
    assert all(t[0]=='tab' for t in tabs) and sum(t[1]=='true' for t in tabs)==1 and p.evaluate("document.querySelector('.journal-tabs').getAttribute('role')")=='tablist',tabs
    p.evaluate(HIDE)
    if view=='libre':menu(p);p.locator('#bCube').click();p.locator('#cubeTabShop').click();assert p.locator('#cubePanelShop').is_visible();p.evaluate(HIDE)
    assert not errors,errors;p.close()
   print(f'PASS menus at {w}x{h}: «Más» closed, fits, two touches, gold stars, no empty labels, volume first in Ajustes',flush=True)
  # Every visible menu button does something, in the World and on the Camino, in both views.
  for view in ('libre','viaje'):
   for where in ('world','camino'):
    if not want(f'buttons-{view}-{where}'):continue
    p,errors=page(b,390,844,view,where);menu(p,True);ids=p.evaluate(VISIBLE_MENU);p.close()
    assert 'bWorld' in ids if where=='camino' else 'bPrimary' in ids,(view,where,ids)
    for id in half(ids):
     p,errors=page(b,390,844,view,where);menu(p,True);before=p.evaluate(STATE)
     label=p.locator('#'+id).inner_text();p.locator('#'+id).click();p.wait_for_timeout(900);after=p.evaluate(STATE)
     # «Seguir hacia X» sets the ring's route to X (often the route it already showed), so it is judged by its route.
     if id=='bContinue' and label.startswith('Seguir hacia ') and after==before:
      assert p.evaluate("__r.ringRoute()?.name")==label.removeprefix('Seguir hacia ') and p.locator('#mMenu').is_hidden(),(view,where,label)
     else:assert after!=before,(view,where,id,'does nothing',before)
     assert not errors,(id,errors);p.close()
    print(f'PASS every visible menu button acts in the {view} view, {"in the World" if where=="world" else "on the Camino"}',flush=True)
  # Every bottom exit says «Cerrar»; the account says it is optional and, with the cloud paused, offers no sign-up or deletion.
  if want('exits'):
   p,errors=page(b,390,844)
   closers=p.evaluate("['placeClose','lugaresClose','portalClose','profileClose','guideClose','houseCodeClose','settingsClose','connectionClose','seedClose','saveToolsClose','kClose','mapClose','journalClose','muClose','sessionClose','sClose','atlasClose','favoritesClose','musicTravelClose','contentGalleryClose','setClose','oClose','playtestClose'].map(id=>[id,document.getElementById(id)?.textContent.trim()])")
   assert all(t=='Cerrar' for _,t in closers),closers
   menu(p,True);p.locator('#bConnection').click();p.wait_for_timeout(400);text=p.inner_text('#mConnection')
   assert 'para jugar' not in text and 'Opcional. Se juega sin cuenta.' in text,text
   assert p.locator('#accountRegister').is_hidden() and p.locator('#accountDelete').is_hidden(),'no sign-up or deletion while the cloud is paused'
   assert p.locator('#connectionClose').is_visible() and p.locator('#connectionClose').inner_text()=='Cerrar'
   assert 'Tu avance se guarda automáticamente' not in text,'no promise of cloud saving without an account'
   assert p.evaluate("__r.cloudPaused()") and not errors,errors;p.close()
   print('PASS every bottom exit says «Cerrar»; the account is optional and offers no sign-up or deletion while the cloud is paused',flush=True)
  b.close()
finally:srv.shutdown()
