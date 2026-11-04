"""Secretos (alpha.244) · the free World on phone (touch swipes) and desktop (arrow keys). The arrow code flashes white,
keeps its eight squares round the cube for 20 s and goes back by itself; seven taps on the menu's logo give the cube its
strange face for 10 s; the origin, 42, 77 and 100 km and the secret asteroid are kept once; at 100 km the gold cube is
worn and taken off in Tu cubo (kept on reload); the Bitácora lists what was found and only «?» for the rest. With the
clock simulated: snow of stars at Christmas, fireworks at New Year, the real full moon at night, balloons on 1 August
(no year kept), and nothing with reduced motion. No sparks."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('SECRETOS_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.save();}"
# The device's clock moved to a local time, still running (Date only; the frame's own clock is untouched).
CLOCK="""(()=>{const target=Date.parse('%s'),D=Date,off=target-D.now();class F extends D{constructor(...a){if(a.length)super(...a);else super(D.now()+off);}static now(){return D.now()+off;}}
 F.UTC=D.UTC;F.parse=D.parse;globalThis.Date=F;})();"""
def page_for(browser,width,height,when=None,reduced=False):
 ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=width<500,timezone_id='America/Guayaquil',reduced_motion='reduce' if reduced else 'no-preference')
 page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 if when:page.add_init_script(CLOCK%when)
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.secretState&&__r.ringState?.().active",timeout=20000)
 page.evaluate(FREE);page.wait_for_function("__r.secretState().allowed",timeout=8000);return ctx,page,errors
def swipe(cdp,x,y,dx,dy):
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
 for k in (1,2,3):cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx*k/3,'y':y+dy*k/3}]})
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
MOVES={'up':(0,-90),'down':(0,90),'left':(-90,0),'right':(90,0)}
CODE=['up','up','down','down','left','right','left','right']
def go(page,x,y):page.evaluate(f"()=>{{__r.S.wx={x};__r.S.wy={y};}}")
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   ctx,page,errors=page_for(browser,width,height,when='2026-11-03T13:00:00')
   sparks=page.evaluate("__r.S.sparks");assert page.evaluate("__r.secretState().count")==0
   # --- 1 · The arrow code: swipes on the phone, keys on the desktop.
   page.evaluate(HIDE)
   if width<500:
    cdp=ctx.new_cdp_session(page)
    for d in CODE:swipe(cdp,width/2,height/2,*MOVES[d]);page.wait_for_timeout(90)
   else:
    page.mouse.click(width/2,height/2+120)
    for d in CODE:page.keyboard.press('Arrow'+d.capitalize());page.wait_for_timeout(60)
   page.wait_for_function("__r.secretState().found.flechas&&__r.secretState().codeLeft>15",timeout=6000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/flechas-{width}.png')
   page.wait_for_function("__r.secretState().codeLeft<19.5",timeout=6000);page.evaluate("__r.secretSkip(21)");assert page.evaluate("__r.secretState().codeLeft")==0,'goes back by itself in 20 s'
   # --- 2 · Seven taps on the logo: the strange face for 10 s, counted once the menu closes.
   page.click('#bMenu');page.wait_for_selector('#mMenu:not([hidden])')
   for i in range(7):page.click('#mMenu .menu-who')
   st=page.evaluate("__r.secretState()");assert st['found'].get('logo')=={} or 'at' in st['found']['logo'],st;assert abs(st['faceLeft']-10)<.2,st['faceLeft']
   assert page.evaluate("document.getElementById('menuAvatar').classList.contains('secret-face')")
   page.evaluate(HIDE);page.wait_for_function("__r.secretState().faceLeft<9.8&&__r.secretState().faceLeft>0",timeout=6000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/cara-{width}.png')
   # --- 3 · The special places, each once; the gold cube at 100 km.
   go(page,60,-40);page.wait_for_function("!!__r.secretState().found.origen",timeout=6000)
   for x,key in [(420050,'km42'),(770050,'km77')]:go(page,x,0);page.wait_for_function(f"!!__r.secretState().found.{key}",timeout=8000)
   assert not page.evaluate("__r.secretState().goldEarned")
   go(page,0,1000100);page.wait_for_function("__r.secretState().gold",timeout=8000);assert page.evaluate("__r.secretState().found.km100.at")
   if SHOTS:page.screenshot(path=f'{SHOTS}/dorado-{width}.png')
   page.evaluate(HIDE);page.click('#bMenu');page.wait_for_selector('#mMenu:not([hidden])');page.click('#bCube');page.wait_for_selector('#mCube:not([hidden])')
   page.wait_for_selector('#cubeSecretSection:not([hidden]) #cubeSecretGold[aria-pressed="true"]',timeout=5000)
   page.locator('#cubeSecretGold').scroll_into_view_if_needed();page.click('#cubeSecretGold')
   page.wait_for_selector('#cubeSecretGold[aria-pressed="false"]',timeout=5000);assert page.evaluate("__r.secretState().gold") is False
   page.reload();page.wait_for_function("!!window.__r?.secretState&&__r.ringState?.().active",timeout=20000);page.evaluate(FREE)
   st=page.evaluate("__r.secretState()");assert st['goldEarned'] and not st['gold'],('taken off, kept on reload',st)
   page.evaluate("__r.secretToggleGold()");assert page.evaluate("__r.secretState().gold") is True
   # The secret asteroid and its note.
   ast=page.evaluate("import('/src/secretos-model.js').then(m=>m.ASTEROID)");go(page,ast['x']-120,ast['y'])
   page.wait_for_function("!!__r.secretState().found.asteroide&&__r.secretState().drawn.asteroid",timeout=8000)
   if SHOTS:page.screenshot(path=f'{SHOTS}/asteroide-{width}.png')
   # --- 4 · The Bitácora: what was found, and only «?» for the rest.
   page.evaluate(HIDE);page.evaluate("__r.openJournal('places')");page.wait_for_selector('#journalSecrets',state='attached',timeout=5000)
   page.evaluate("document.getElementById('journalSecrets').open=true;document.getElementById('journalSecrets').scrollIntoView()")
   j=page.evaluate("(()=>{const e=document.getElementById('journalSecrets');return {summary:e.querySelector('summary').textContent,rows:e.querySelectorAll('.secret-row').length,missing:e.querySelectorAll('.secret-missing span').length,text:e.textContent}})()")
   n=page.evaluate("__r.secretState().count");assert n==7 and j['summary']=='Secretos · 7' and j['rows']==7 and j['missing']==8,j   # alpha.247: eleven secrets and the sky's four, seven found
   for hidden in ['Nieve de estrellas','Fuegos','Luna llena','Un día especial']:assert hidden not in j['text'],('no spoiler',hidden)
   assert 'Estuvimos aquí' in j['text']
   if SHOTS:page.screenshot(path=f'{SHOTS}/bitacora-{width}.png')
   assert page.evaluate("__r.S.sparks")==sparks,'the special pays no sparks'
   assert not errors,errors;ctx.close()
  # --- 5 · Real dates, the clock simulated (Guayaquil time). Two per size; reduced motion turns them off.
  for width,height,when,want in [(390,844,'2026-12-24T12:00:00','navidad'),(390,844,'2026-11-24T22:00:00','luna'),(1280,800,'2026-12-31T20:00:00','anonuevo'),(1280,800,'2027-08-01T10:00:00','especial')]:
   ctx,page,errors=page_for(browser,width,height,when=when)
   page.wait_for_function(f"__r.secretState().date==='{want}'&&__r.secretState().drawn.date==='{want}'&&!!__r.secretState().found.{want}",timeout=12000)
   if want=='anonuevo':page.wait_for_function("(__r.secretState().drawn.bursts||0)>=2",timeout=8000)
   if SHOTS:page.evaluate(HIDE);page.wait_for_timeout(300);page.screenshot(path=f'{SHOTS}/fecha-{want}-{width}.png')
   if want=='especial':assert page.evaluate("JSON.stringify(__r.S.secrets.found.especial)")=='{}','no day, no year'
   assert not errors,errors;ctx.close()
  ctx,page,errors=page_for(browser,390,844,when='2026-12-25T12:00:00',reduced=True)
  page.wait_for_function("__r.secretState().date==='navidad'",timeout=12000);page.wait_for_timeout(600)
  st=page.evaluate("__r.secretState()");assert not st['drawn'].get('date') and 'navidad' not in st['found'],('off with reduced motion',st)
  ctx.close();browser.close()
 elapsed=time.time()-started;assert elapsed<145,elapsed
 print(f'PASS secretos on phone and desktop in {elapsed:.0f} s: the arrow code by swipes and keys (flash, 20 s, back by itself); seven taps give the face for 10 s; origin, 42, 77 and 100 km and the asteroid kept once; the gold cube worn, taken off in Tu cubo and kept on reload; the Bitácora with «?» for the rest; Christmas, the full moon, New Year and 1 August with the clock simulated (no year kept), none with reduced motion; no sparks',flush=True)
finally:server.shutdown()
