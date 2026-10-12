from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil, threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{server.server_port}/'
CHROMIUM = os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('chromium-browser')

with sync_playwright() as p:
 b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  c=b.new_context(viewport=size);page=c.new_page();page.set_default_timeout(5000);page.add_init_script('window.__audioContexts=[];window.AudioContext=class extends AudioContext {constructor(...args){super(...args);window.__audioContexts.push(this);}}');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('summary').click();page.locator('#dFill').click();page.locator('#cExplore').click();page.locator('#hwGo').click();page.wait_for_function('window.__audioContexts.length === 1 && window.__audioContexts[0].state === "running" && window.__audioContexts[0].currentTime > 0')
  assert page.locator('#reto').is_visible()
  page.evaluate('''()=>{const r=window.__testRuntime;for(let i=0;i<12;i++){const region=r.regionOfPos(i*3600+900,900);for(const kind of ['arbol','cristal','pilar','loto','luz','pulso','luciernaga'])r.playVoice(kind,i,r.ac.currentTime+.05,region,true);for(const sp of region.species)r.speciesSound(sp,r.ac.currentTime+.05,true);}}''')
  page.keyboard.press('Space')
  page.keyboard.down('d');page.wait_for_timeout(300);page.keyboard.up('d')
  page.locator('#bPrimary').click();page.locator('#bPrimary').click();assert page.locator('#reto').is_visible()
  page.locator('#bMenu').click();page.wait_for_timeout(2200);before=page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).lampUsed');page.wait_for_timeout(2200);after=page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).lampUsed');assert abs(after-before)<.1,(before,after)
  page.locator('#dNext').click();assert not page.locator('#reto').is_visible();assert not page.locator('#mCap').is_visible()
  page.wait_for_timeout(2100);assert page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).mode')=='camino'
  page.locator('#bMenu').click();page.locator('#bStudio').click();page.locator('#w').click(position={'x':size['width']/2,'y':size['height']/2-min(size['width'],size['height']-260)*.13});assert page.evaluate('Object.keys(JSON.parse(localStorage.getItem("pixel-blanco-v4")).studio.slots).length')==1
  page.locator('#stExit').click();page.reload(wait_until='domcontentloaded');page.wait_for_function('document.getElementById("bMenu").onclick !== null');assert page.evaluate('Object.keys(JSON.parse(localStorage.getItem("pixel-blanco-v4")).studio.slots).length')==1
  page.locator('#bMenu').click();page.locator('#bShare').click();assert page.locator('#shareImg').evaluate('(i)=>i.naturalWidth>0');assert not errors,errors
  print(label+': challenges, day rollover, paused lamp, studio persistence, sharing PASS',flush=True);c.close()
 b.close()
server.shutdown()
