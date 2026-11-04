"""Menús (alpha.257): what a player sees in production, without body.dev (local hosts, ?dev=1 and automated browsers
turn it on, so this flow takes it off). At 390×844 and 1280×800: no timing controls, deploy line, diagnostic, world
data, free seed field or seed presets; the version stays, small; no «Cuenta» while the cloud is paused and «Guardar
copia» in its place; one volume, in Ajustes; «Avanzado» folded in «Más sonido»; three clear names for the three modes;
three walks, a saved fourth kept as it was; Ajustes in the agreed order with «Empezar de cero» last; «Volver al Camino»
in view; stars and places first in «Tú». With body.dev back, the tools are still there for tests and development."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
VERSION=json.loads((ROOT/'package.json').read_text())['version']
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true)"
SHOWN="id=>{const e=document.getElementById(id);if(!e)return false;const r=e.getBoundingClientRect();return !e.hidden&&e.checkVisibility({visibilityProperty:true})&&getComputedStyle(e).display!=='none'&&r.width>0&&r.height>0}"
PLAYER="document.body.classList.remove('dev')"
DEV_ONLY=['latencyLess','latencyMore','latencyNow','latencyAgain','releaseDeploy','diagnosticInfo','diagnosticCopy','bDetails']
def shown(p,id):return p.evaluate(SHOWN,id)
def load(b,w,h):
 p=b.new_page(viewport={'width':w,'height':h});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.openLugares&&!!window.__r?.tidyMenu');p.wait_for_timeout(2000);p.evaluate(HIDE)
 if p.evaluate('__r.journeyMode()')!='libre':assert p.evaluate("__r.setJourneyMode('libre')")
 p.evaluate(PLAYER);p.evaluate(HIDE);p.wait_for_timeout(200);return p,errors
def settings(p):
 p.evaluate(HIDE);p.locator('#bMenu').click();p.wait_for_timeout(120);p.locator('#bSettings').click();p.wait_for_timeout(150)
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for w,h in [(390,844),(1280,800)]:
   p,errors=load(b,w,h)
   assert not p.evaluate("document.body.classList.contains('dev')") and p.evaluate("document.body.classList.contains('cloud-paused')"),'a player, with the cloud paused'
   # The menu: no «Simple.», «Volver al Camino» in view under «Jugar»; in «Más», «Guardar copia» and no «Cuenta».
   p.locator('#bMenu').click();p.wait_for_timeout(150)
   assert p.locator('#mMenu .menu-footnote').count()==0,'no footnote'
   assert shown(p,'bPrimary') and p.evaluate("!!document.getElementById('bPrimary').closest('.menu-group.primary')"),'«Volver al Camino» in view'
   p.locator('#menuMore > summary').click();p.wait_for_timeout(150)
   assert not shown(p,'bConnection'),'no «Cuenta» while the cloud is paused'
   assert shown(p,'bSaveTools'),'«Guardar copia» on the web while the cloud is paused'
   assert p.inner_text('#bJourneyMode').startswith('Mostrar todo: sí'),p.inner_text('#bJourneyMode')
   maps=p.evaluate("[...document.querySelectorAll('#mMenu button')].filter(b=>{const r=b.getBoundingClientRect();return !b.hidden&&getComputedStyle(b).display!=='none'&&r.width>0&&/mapa/i.test(b.textContent)}).map(b=>b.id)")
   assert len(maps)<=1,('one map button in the menu',maps)
   p.locator('#bSaveTools').click();p.wait_for_selector('#mSaveTools:not([hidden])');p.locator('#saveToolsClose').click()
   # Ajustes: the agreed order, no developer tools, the version small, «Empezar de cero» last and apart.
   settings(p)
   for id in DEV_ONLY:assert not shown(p,id),(w,h,id,'visible to a player')
   assert shown(p,'releaseVersion') and p.inner_text('#releaseVersion')=='v'+VERSION,p.inner_text('#releaseVersion')
   assert float(p.evaluate("parseFloat(getComputedStyle(document.getElementById('releaseVersion')).fontSize)"))<=12,'the version is small'
   order=p.evaluate("[...document.querySelectorAll('#mSettings :is(input,select,button)')].filter(e=>{if(e.matches('.sheet-close'))return false;const r=e.getBoundingClientRect();return !e.hidden&&getComputedStyle(e).display!=='none'&&r.width>0}).map(e=>e.id)")
   assert order[:6]==['rMenuVolume','language','calmKids','haptics','colorSafe','graphicsQuality'],order
   assert order[-2:]==['bStartOver','settingsClose'],order
   gap=p.evaluate("(()=>{const a=document.getElementById('bStartOver').getBoundingClientRect(),prev=document.getElementById('releaseVersion').getBoundingClientRect();return a.top-prev.bottom})()")
   assert gap>=24,('«Empezar de cero» apart',gap)
   assert p.evaluate("document.querySelector('label:has(#calmKids)').textContent.trim()")=='Modo niños'
   assert p.inner_text('#bCreateMode').startswith('Crear libre: '),p.inner_text('#bCreateMode')
   options=p.evaluate("[...document.getElementById('autoIntent').options].map(o=>o.value)");assert len(options)<=3,options
   # «Más sonido»: one volume (in Ajustes), the hard words folded in «Avanzado».
   p.locator('#bMusicSettings').click();p.wait_for_timeout(150)
   assert not shown(p,'rVolume') and shown(p,'bSound') and shown(p,'bSoft')
   assert not p.evaluate("document.getElementById('musicAdvanced').open")
   for id in ('rStyle','bAutoPins','scenesSetting','voiceMode'):assert not shown(p,id),(id,'outside «Avanzado»')
   p.locator('#musicAdvanced > summary').click();p.wait_for_timeout(100)
   for id in ('rStyle','bAutoPins','scenesSetting','voiceMode'):assert shown(p,id),(id,'inside «Avanzado»')
   p.locator('#muClose').click();p.locator('#settingsClose').click()
   # Seeds from «Viajar a otra tierra»: no free field and no presets; the three ways stay.
   p.evaluate(HIDE);p.evaluate('__r.openSeedLab(false)');p.wait_for_selector('#mSeeds:not([hidden])')
   for id in ('seedForm','seedValue','seedPresets'):assert not shown(p,id),(id,'seed tool visible')
   for id in ('seedNext','seedOriginal','seedClose'):assert shown(p,id),(id,'seed way missing')
   p.locator('#seedClose').click()
   # Bitácora › Tú: ★ and places first, the grown-up numbers after.
   p.evaluate(HIDE);p.locator('#bMenu').click();p.locator('#bAch').click();p.locator('[data-journal-tab="you"]').click();p.wait_for_timeout(200)
   assert p.inner_text('#profileStars').startswith('★ ') and p.inner_text('#profileStars').endswith('/33'),p.inner_text('#profileStars')
   assert p.inner_text('#profileRing').endswith('/11'),p.inner_text('#profileRing')
   first=p.evaluate("[...document.querySelectorAll('#journalYouPart dt,#journalYouPart .profile-map span')].map(e=>e.textContent)")
   assert first[:2]==['Estrellas','Lugares'] and first.index('Regiones')>first.index('Tiempo activo'),first
   p.screenshot(path=f'/tmp/whitedot-menus-produccion-tu-{w}.png')
   # A saved walk no longer listed keeps working and stays saved; the list shows its nearest choice.
   p.evaluate("()=>{__r.S.autoIntent='contraste';__r.save();}");p.reload();p.wait_for_function('!!window.__r?.openLugares');p.wait_for_timeout(800);p.evaluate(PLAYER)
   assert p.evaluate('__r.S.autoIntent')=='contraste' and p.evaluate("document.getElementById('autoIntent').value")=='hallazgos'
   # With body.dev back (tests, localhost, ?dev=1) the tools are still there.
   p.evaluate("document.body.classList.add('dev')");settings(p)
   for id in ('latencyNow','releaseDeploy','diagnosticCopy','bDetails'):assert shown(p,id),(id,'gone for development')
   p.evaluate(HIDE);p.locator('#bMenu').click();p.locator('#menuMore > summary').click();p.wait_for_timeout(100);assert shown(p,'bConnection'),'«Cuenta» still reachable in development'
   assert not errors,errors;p.close()
   print(f'PASS menus in production at {w}x{h}: no developer tools, version small, no «Cuenta» while paused, «Guardar copia», one volume, «Avanzado», clear modes, three walks, agreed order, stars first; tools back with body.dev',flush=True)
  b.close()
finally:srv.shutdown()
