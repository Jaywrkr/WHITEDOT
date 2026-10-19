from browser_helpers import complete_path_fixture
# Navegador: mesa de efectos. El pad filtra y da espacio, vuelve a limpio al soltar, Fijar lo mantiene, Stop frena y no mueve al pixel.
from pathlib import Path
from playwright.sync_api import sync_playwright
import os, shutil, threading, json
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
 for label,size in [('mobile',{'width':390,'height':844}),('desktop',{'width':1280,'height':800})]:
  b=p.chromium.launch(executable_path=CHROMIUM,args=['--no-sandbox'])
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(10000);errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click();page.locator('#dFill').click();complete_path_fixture(page);page.locator('#cExplore').click();page.locator('#hwGo').click()
  page.wait_for_function("window.__testRuntime.MU.dnaA && window.__testRuntime.ac.state==='running'")
  baseline=page.evaluate('localStorage.getItem("pixel-blanco-v4")')
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click() if not page.locator('details.devbox').evaluate('(el)=>el.open') else None;page.locator('#dSeeds').click();assert page.locator('#mSeeds').is_visible()
  baseline=page.evaluate('()=>{window.__testRuntime.S.sound=false;window.__testRuntime.S.arrivalMode="continue";window.__testRuntime.applyComfort();window.__testRuntime.save();return localStorage.getItem("pixel-blanco-v4");}')
  page.locator('[data-seed="blobs-01"]').click();page.wait_for_url('**testSeed=blobs-01*');page.wait_for_function('window.__testRuntime?.S.previewSeed==="blobs-01" && window.__testRuntime.S.mode==="world"')
  first=page.evaluate('()=>{const r=window.__testRuntime,d=r.regionOfPos(r.S.wx,r.S.wy);if(r.S.wx!==r.REG*r.WCH/2||r.S.wy!==r.S.wx)throw Error("not centered");return JSON.stringify([d.z,d.genre,d.track,d.species,d.ground,d.air]);}')
  assert page.evaluate('localStorage.getItem("pixel-blanco-v4")')==baseline
  page.evaluate("()=>{const r=window.__testRuntime;if(r.REG!==12||r.worldIdentity.generatorVersion!==2)throw Error('expanded wide world missing');const c=r.wchunk(Math.floor(r.S.wx/r.WCH),Math.floor(r.S.wy/r.WCH)),v=r.sceneChunk(c);if(v.grass.length>c.grass.length||v.sp.length>c.sp.length)throw Error('clutter not reduced');if(!v.sp.some(o=>o.id?.startsWith('nursery:')&&Math.hypot(o.x-r.S.wx,o.y-r.S.wy)<120))throw Error('no blob near center');if(!r.blobHabitat(r.regionOfPos(r.S.wx,r.S.wy)))throw Error('blob habitat missing');const voices=c.sp.map(o=>r.getVoice('forma:'+o.s.id,r.regionOfPos(r.S.wx,r.S.wy)));if(voices.some(v=>v.role==='agudo'||v.high>72))throw Error('blob voices too high');}")
  page.locator('#w').click(position={'x':30,'y':300});page.wait_for_function('window.__testRuntime.ac.state==="running"')
  page.evaluate("()=>{const r=window.__testRuntime,c=r.sceneChunk(r.wchunk(Math.floor(r.S.wx/r.WCH),Math.floor(r.S.wy/r.WCH))),o=c.sp.find(o=>o.id?.startsWith('nursery:')),ac=r.ac,osc=ac.createOscillator.bind(ac),buffer=ac.createBufferSource.bind(ac);let n=0;ac.createOscillator=()=>{n++;return osc();};ac.createBufferSource=()=>{n++;return buffer();};try{r.withVoiceOrigin('player',()=>r.speciesSound(o.s,ac.currentTime+.08,true,o.personality,o));if(!n)throw Error('blob has no audible voice');}finally{ac.createOscillator=osc;ac.createBufferSource=buffer;}}")
  page.wait_for_timeout(400);page.screenshot(path=f'/tmp/whitedot-blobs-{label}.png')
  page.evaluate('window.__testRuntime.S.wx+=400');page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click() if not page.locator('details.devbox').evaluate('(el)=>el.open') else None;page.locator('#dSeeds').click();page.locator('#seedCenter').click();page.wait_for_function('window.__testRuntime && window.__testRuntime.S.wx===window.__testRuntime.REG*window.__testRuntime.WCH/2')
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click() if not page.locator('details.devbox').evaluate('(el)=>el.open') else None;page.locator('#dSeeds').click();page.locator('[data-seed="blobs-02"]').click();page.wait_for_url('**testSeed=blobs-02*');page.wait_for_function('window.__testRuntime?.S.previewSeed==="blobs-02"')
  second=page.evaluate('()=>{const r=window.__testRuntime,d=r.regionOfPos(r.S.wx,r.S.wy);return JSON.stringify([d.z,d.genre,d.track,d.species,d.ground,d.air]);}');assert first!=second
  page.locator('#bMenu').click();page.locator('#mMenu .devbox > summary').click() if not page.locator('details.devbox').evaluate('(el)=>el.open') else None;page.locator('#dSeeds').click();page.locator('#seedOriginal').click();page.wait_for_function('window.__testRuntime && !window.__testRuntime.S.previewSeed');restored=page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4"))');original=json.loads(baseline)
  for field in ['ach','cat','bag']:
   for key,value in original.get(field,{}).items():assert restored[field].get(key)==value,(field,key)
  assert all(star in restored['stars'] for star in original['stars'])
  assert restored['practiceTravel']['arrivals']>original.get('practiceTravel',{}).get('arrivals',0),'returning from a preview is a new visit; its earned main progress stays intact'
  assert not errors,errors
  print(label+': prototype seed switching, whole-world variation, center, preview save isolation and return to main save PASS',flush=True);c.close();b.close()
server.shutdown()
