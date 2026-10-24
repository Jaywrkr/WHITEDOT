"""Real recipe destinations, individual decisions and Geist in UI, world and exports."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script('''window.__fonts=[];const fill=CanvasRenderingContext2D.prototype.fillText;
   CanvasRenderingContext2D.prototype.fillText=function(...args){__fonts.push(this.font);if(__fonts.length>500)__fonts.shift();return fill.apply(this,args);};''')
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  url=f'http://127.0.0.1:{server.server_port}/'
  page.goto(url+'?testSeed=laboratorio&lab=1&layout=wide&generation=2');page.wait_for_function('__testRuntime?.labMode')
  page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  ids=page.evaluate('import("/src/musical-recipes.js").then(m=>m.MUSIC_IDENTITIES.map(r=>r.id))')
  destinations=[]
  for identity in ids:
   page.evaluate('(id)=>__testRuntime.labGo("music:"+id)',identity)
   page.wait_for_function('(id)=>__testRuntime.MU.radio?.identity?.id===id',arg=identity,timeout=12000)
   result=page.evaluate('''()=>{const r=__testRuntime;return {key:r.MU.dnaA.key,identity:r.MU.radio.identity.id,
    overflow:document.documentElement.scrollWidth>innerWidth,family:getComputedStyle(document.getElementById('labName')).fontFamily};}''')
   assert result['identity']==identity and not result['overflow'] and 'Geist Mono' in result['family'],result
   destinations.append(result['key'])
  assert len(set(destinations))==16,'lab must use actual distinct places, not cosmetic labels'
  page.evaluate('''()=>{const r=__testRuntime;r.labGo('living:turtle');document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}''')
  page.wait_for_function('__testRuntime.livingNear()[0]?.mind!==undefined')
  assert page.evaluate('__testRuntime.livingNear()[0].mind.version')==1
  page.locator('#bMenu').click()
  assert page.evaluate('''()=>[...document.querySelectorAll('#mMenu *')].filter(e=>e.getClientRects().length&&e.textContent.trim()).every(e=>getComputedStyle(e).fontFamily.includes('Geist Mono'))''')
  (page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bMap').click();page.locator('#mapShare').click()
  page.wait_for_function('!document.getElementById("mShare").hidden&&document.getElementById("shareImg").src.startsWith("data:image/png")')
  assert page.evaluate('__fonts.length>0&&__fonts.every(f=>f.includes("Geist Mono"))'),page.evaluate('__fonts')
  page.screenshot(path='/tmp/whitedot-m1-geist-export.png')
  assert not errors,errors
  print('PASS all 16 real musical destinations, live individual profile, mobile UI and Canvas/export Geist Mono',flush=True)
  b.close()
finally:server.shutdown()
