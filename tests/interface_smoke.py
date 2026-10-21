"""UI acceptance: all main sheets, compact tools, focus isolation and silent navigation."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading, shutil, os

ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(320,568),(360,640),(390,844),(844,390),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height},has_touch=True)
   page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=bosque-01&layout=vasto&generation=2')
   page.wait_for_function('__testRuntime?.inWorld()')
   page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
   page.wait_for_function('!document.getElementById("w").inert')
   page.locator('#bMenu').click()
   assert page.locator('#w').evaluate('(e)=>e.inert'), 'canvas cannot receive focus behind a modal'
   assert page.locator('.menu-group h3').all_text_contents()==['Jugar','Tu viaje','Crear','General']
   # Optional account stays available; without configuration it explains local-only mode.
   page.wait_for_function('!document.getElementById("bConnection").hidden')
   page.locator('#mMenu .sheet').evaluate('e=>e.scrollTop=e.scrollHeight')
   close=page.locator('#mnClose').bounding_box()
   assert close['y']>=0 and close['y']+close['height']<=height, 'close stays visible while menu scrolls'
   page.locator('#mMenu .sheet').evaluate('e=>e.scrollTop=0')
   # A native summary participates in the focus loop, including reverse Tab.
   page.locator('#mMenu summary').focus();page.keyboard.press('Tab')
   assert page.evaluate('document.getElementById("mMenu").contains(document.activeElement)')
   page.locator('#mMenu summary').click();page.locator('#dFill').focus();page.keyboard.press('Shift+Tab')
   assert page.evaluate('document.activeElement.tagName')=='SUMMARY'
   page.locator('#mMenu summary').click()
   page.keyboard.press('Escape');page.wait_for_function('document.activeElement.id==="bMenu"')
   assert not page.locator('#w').evaluate('(e)=>e.inert')
   for control,modal in [('bMusicSettings','mMusic'),('bCube','mCube'),('bAch','mJournal'),('bMap','mJournal'),('bSettings','mSettings'),('bSaveTools','mSaveTools')]:
    page.locator('#bMenu').click()
    if control in ['bSky','bSession']:page.locator('#bAch').click()
    if control=='bSaveTools':
     assert page.locator('#bSaveTools').is_hidden();page.evaluate("document.getElementById('mMenu').hidden=true;(window.__r||window.__testRuntime).openSaveTools()")
    else:page.locator('#'+control).click()
    page.wait_for_function('(id)=>!document.getElementById(id).hidden',arg=modal)
    metrics=page.locator('#'+modal+' .sheet').evaluate('e=>({x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right,y:e.getBoundingClientRect().y,bottom:e.getBoundingClientRect().bottom,sw:e.scrollWidth,cw:e.clientWidth})')
    assert metrics['x']>=0 and metrics['right']<=width+1 and metrics['y']>=0 and metrics['bottom']<=height+1, (modal,metrics)
    assert metrics['sw']<=metrics['cw']+1,(modal,'horizontal overflow',metrics)
    undersized=page.locator('#'+modal+' button:visible').evaluate_all('buttons=>buttons.filter(b=>!b.disabled&&b.getBoundingClientRect().height<43.5).map(b=>b.outerHTML)')
    assert not undersized,(modal,undersized)
    assert page.locator('#'+modal).evaluate('(e)=>e.contains(document.activeElement)')
    if modal=='mMusic':
     before=page.evaluate('({style:__testRuntime.S.style,waves:__testRuntime.waves.length,queue:__testRuntime.MU.queue.length})')
     page.wait_for_timeout(80)
     assert page.evaluate('__testRuntime.S.style')==before['style'], 'opening settings cannot alter music'
     assert page.evaluate('__testRuntime.waves.length')<=before['waves']
     assert page.evaluate('__testRuntime.MU.queue.length')<=before['queue']
     page.locator('#rStyle').focus();page.keyboard.press('ArrowRight');assert page.evaluate('__testRuntime.S.style')>before['style']
    if width==390:
     page.locator('#'+modal+' .sheet').evaluate('e=>e.scrollTop=0')
     page.screenshot(path=f'/tmp/whitedot-interface-{modal}-mobile.png')
    page.locator('#'+modal+' .sheet-close').click()
    assert page.locator('#'+modal).is_hidden()
    page.wait_for_function('!document.getElementById("w").inert')
   page.locator('#bMenu').click();page.locator('#bTools').click()
   page.wait_for_function('document.activeElement.id==="bFx"')
   buttons=page.locator('#dock button:visible').evaluate_all('bs=>bs.map(b=>{const r=b.getBoundingClientRect();return {id:b.id,x:r.x,right:r.right,h:r.height,w:r.width}})')
   assert all(b['x']>=0 and b['right']<=width+1 and b['h']>=44 and b['w']>=44 for b in buttons),buttons
   page.locator('#bFx').click();page.wait_for_function('document.activeElement.id==="fxPad"')
   assert page.locator('#fxPanel').bounding_box()['y']>=0
   page.locator('#fxHold').click();page.locator('#fxPad').focus();page.keyboard.press('Shift+ArrowUp')
   assert page.evaluate('__testRuntime.fxState.y')>=.09
   assert page.evaluate('__testRuntime.keys.arrowup||0')==0
   page.keyboard.press('Home');assert page.evaluate('__testRuntime.fxState.x===.5&&__testRuntime.fxState.y===0')
   page.keyboard.press('Escape');assert page.locator('#fxPanel').is_hidden()
   assert page.evaluate('document.activeElement.id')=='bMenu'
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight')
   assert not errors,errors
   print(f'PASS UI {width}×{height}: eight real sheets, optional account entry available in local mode, touch targets, no overflow, summary/focus return, silent settings and keyboard effects',flush=True)
   page.close()
  browser.close()
finally: server.shutdown()
