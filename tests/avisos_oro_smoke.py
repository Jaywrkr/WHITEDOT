"""Avisos y oro (coherencia T4, alpha.261) · phone (390x844), the free World after the Journey. One box, one notice:
its card says «Cometa · Corre y suena.» with one clock; the power and the surprise HUDs wait under it, and after it one
clock shows at a time; the box's achievements wait unread in the Bitácora instead of following the card. Gold only on
what is earned: «✦ 0» is white and «✦ 5» gold; a name in an everyday notice is white and an earned one gold; «Ir solo»
on, the effects pad and the narrator are white. Crossing several bands at once gives one notice, «Nombre · Empiezan
aquí.», never «Aquí empiezan…»."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,time
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('AVISOS_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.liveEncounterRest?.();r.save();}"
# Every notice the lane shows, as it shows it, and every 100 ms what is on screen with a clock.
WATCH="""()=>{window.__shown=[];window.__worst=0;window.__samples=0;const ids=['toast','phrase','zone','voice','rareNotice','celebration'];
 const visible=e=>e&&!e.hidden&&getComputedStyle(e).visibility==='visible'&&getComputedStyle(e).display!=='none'&&(e.id!=='voice'||e.classList.contains('on'));
 for(const id of ids){const e=document.getElementById(id);new MutationObserver(()=>{const s=(id==='celebration'?document.getElementById('celebrationLine').textContent:e.textContent).trim();if(visible(e)&&s&&window.__shown.at(-1)!==s)window.__shown.push(s);}).observe(e,{childList:true,subtree:true,characterData:true,attributes:true});}
 window.__tick=setInterval(()=>{const n=ids.filter(id=>visible(document.getElementById(id))).length+['sparkPowerHud','surpriseHud'].filter(id=>visible(document.getElementById(id))).length;window.__worst=Math.max(window.__worst,n);window.__samples++;},100);}"""
GOLD='rgb(240, 210, 122)'
def color(page,sel):return page.evaluate(f"getComputedStyle(document.querySelector({sel!r})).color")
started=time.time()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script("Object.defineProperty(navigator,'languages',{get:()=>['es-ES']})")
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.celebrationState&&__r.ringState?.().active&&!!__r.bandState",timeout=30000)
  page.evaluate(FREE);page.wait_for_function("__r.inWorld()&&__r.bandState().allowed",timeout=10000)
  # --- 1 · «✦ 0» is not gold; the first chispa is.
  page.evaluate("()=>{__r.S.sparks=0;if(__r.S.sparkEconomy)__r.S.sparkEconomy.sparks=0;}");page.wait_for_function("document.getElementById('sparkCount').classList.contains('empty')",timeout=5000)
  assert color(page,'#sparkTotal')!=GOLD,'«✦ 0» is white: nothing earned yet'
  if SHOTS:page.screenshot(path=f'{SHOTS}/hud-0-chispas.png')
  page.evaluate("()=>{__r.S.sparks=5;if(__r.S.sparkEconomy)__r.S.sparkEconomy.sparks=5;}");page.wait_for_function("!document.getElementById('sparkCount').classList.contains('empty')",timeout=5000)
  assert color(page,'#sparkTotal')==GOLD,'chispas earned are gold'
  # --- 2 · An everyday name is white; an earned one gold (one rule in the lane).
  page.evaluate("__r.toast('<em>Ir solo</em> · Elige un destino en esta capa.',{level:2})");page.wait_for_function("document.getElementById('toast').classList.contains('on')&&document.getElementById('toast').textContent.includes('Ir solo')",timeout=8000)
  assert page.get_attribute('#toast','data-earned')=='false';assert color(page,'#toast em')=='rgb(255, 255, 255)','a state is white'
  if SHOTS:page.screenshot(path=f'{SHOTS}/aviso-blanco.png')
  page.evaluate("__r.noticeLane.cancel('toast')");page.wait_for_timeout(600)
  page.evaluate("__r.toast('Color nuevo · <em>Ámbar</em>',{level:2,category:'ganado'})");page.wait_for_function("document.getElementById('toast').classList.contains('on')&&document.getElementById('toast').textContent.includes('Ámbar')",timeout=8000)
  assert page.get_attribute('#toast','data-earned')=='true';assert color(page,'#toast em')==GOLD,'what you earned is gold'
  if SHOTS:page.screenshot(path=f'{SHOTS}/aviso-ganado.png')
  page.evaluate("__r.noticeLane.cancel('toast')");page.wait_for_timeout(600)
  # States are white: «Ir solo» on, the pad's handle, the narrator line.
  page.evaluate("document.getElementById('routeAuto').setAttribute('aria-pressed','true')")
  assert page.evaluate("getComputedStyle(document.getElementById('routeAuto')).borderColor")!=GOLD;page.evaluate("document.getElementById('routeAuto').setAttribute('aria-pressed','false')")
  page.evaluate("(()=>{const p=document.createElement('p');p.className='narrator-line';p.id='__nl';p.textContent='x';document.body.append(p);const d=document.createElement('div');d.className='fxpad';d.innerHTML='<i id=__fx></i>';document.body.append(d);})()")
  assert color(page,'#__nl')!=GOLD and page.evaluate("getComputedStyle(document.getElementById('__fx')).borderTopColor")!=GOLD
  page.evaluate("document.getElementById('__nl').remove();document.getElementById('__fx').parentElement.remove()")
  # --- 3 · One box, one notice.
  page.evaluate(WATCH)
  page.evaluate("()=>{const r=__r;"+HIDE+";r.spawnBox(r.S.wx,r.S.wy,'cometa');}")
  page.wait_for_function("__r.hasPower('cometa')",timeout=8000)
  page.evaluate("()=>{if(!__r.surpriseState.ids.length)__r.giveSurprise('pequeno');}")
  page.wait_for_function("!document.getElementById('celebration').hidden",timeout=8000)
  line=page.inner_text('#celebrationLine');assert line.startswith('Cometa · Corre y suena.') and '¡' not in line and '!' not in line,line
  assert page.evaluate("getComputedStyle(document.getElementById('sparkPowerHud')).visibility")=='hidden' and page.evaluate("getComputedStyle(document.getElementById('surpriseHud')).visibility")=='hidden','the HUDs wait under the card'
  if SHOTS:page.screenshot(path=f'{SHOTS}/caja-abierta.png')
  page.wait_for_timeout(1500);assert page.evaluate("window.__worst")==1,('one notice or clock while the card shows',page.evaluate("window.__worst"))
  page.evaluate("clearInterval(window.__tick)");page.locator('#celebrationDismiss').click();page.wait_for_function("document.getElementById('celebration').hidden",timeout=5000)
  page.wait_for_function("!document.getElementById('sparkPowerHud').hidden",timeout=5000)
  assert page.evaluate("getComputedStyle(document.getElementById('surpriseHud')).visibility")=='hidden','one clock: the power\'s'
  if SHOTS:page.screenshot(path=f'{SHOTS}/caja-despues.png')
  # The box's achievements (caja1, poder_cometa) are earned and wait in the Bitácora; they do not follow the card.
  page.wait_for_timeout(5000);shown=page.evaluate("window.__shown")
  assert page.evaluate("!!__r.S.ach.caja1&&!!__r.S.ach.poder_cometa"),'earned'
  assert shown==[line],('the card is the box\'s only notice',shown)
  # --- 4 · Crossing many bands at once: one notice, «Nombre · Empiezan aquí.».
  page.evaluate("()=>{__r.clearPowers?.();__r.clearSurprise?.();__r.noticeLane.cancel('toast');}")
  page.evaluate("()=>{window.__toasts=[];const t=document.getElementById('toast');new MutationObserver(()=>{const s=t.textContent.trim();if(s&&window.__toasts.at(-1)!==s)window.__toasts.push(s);}).observe(t,{childList:true,subtree:true,characterData:true});}")
  page.evaluate("()=>{__r.S.wx=0;__r.S.wy=52000;}");page.wait_for_function("!!__r.bandState().book.seen.pelota&&!!__r.bandState().book.seen.luces",timeout=8000)
  page.wait_for_function("window.__toasts.some(t=>t.includes('Empieza'))",timeout=20000);page.wait_for_timeout(13000)
  toasts=page.evaluate("window.__toasts");bands=[t for t in toasts if 'mpieza' in t]
  assert bands==['Retos de luces · Empiezan aquí.'],('one notice, the farthest',toasts)
  assert not [t for t in toasts if 'Aquí empiezan' in t],toasts
  if SHOTS:page.screenshot(path=f'{SHOTS}/banda.png')
  assert not errors,errors
  browser.close()
 print(f'PASS avisos y oro: one box one notice (card, then one clock; its achievements wait in the Bitácora), gold only for what is earned (✦ 0 white, earned names gold, states white), one band notice per crossing ({time.time()-started:.0f} s)',flush=True)
finally:server.shutdown()
