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
  c=b.new_context(viewport=size,has_touch=label=='mobile');page=c.new_page();page.set_default_timeout(5000);page.add_init_script('window.__audioContexts=[];window.AudioContext=class extends AudioContext {constructor(...args){super(...args);window.__audioContexts.push(this);}}');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(URL,wait_until='domcontentloaded');page.wait_for_function('!document.getElementById("mHelpC").hidden');page.locator('#hcGo').click()
  page.locator('#bMenu').click();page.locator('summary').click();page.locator('#dFill').click();page.locator('#cExplore').click();page.locator('#hwGo').click();page.wait_for_function('window.__audioContexts.length === 1 && window.__audioContexts[0].state === "running" && window.__audioContexts[0].currentTime > 0')
  assert page.locator('#reto').is_visible()
  page.evaluate('''()=>{const r=window.__testRuntime;for(let i=0;i<12;i++){const region=r.regionOfPos(i*3600+900,900);for(const kind of ['arbol','cristal','pilar','loto','luz','pulso','luciernaga'])r.playVoice(kind,i,r.ac.currentTime+.05,region,true);for(const sp of region.species)r.speciesSound(sp,r.ac.currentTime+.05,true);}}''')
  page.evaluate('''async()=>{const r=window.__testRuntime,{gravityOf}=await import('/src/gravity.js');const oldRAF=window.requestAnimationFrame,oldX=r.S.wx,oldY=r.S.wy;window.requestAnimationFrame=()=>0;try{for(const factor of [.7,1,1.35]){let region,x,y;for(let i=-10;i<=10;i++){x=i*3600+1800;y=1800;region=r.regionOfPos(x,y);if(gravityOf(region,r.seedOf).multiplier===factor)break;}if(gravityOf(region,r.seedOf).multiplier!==factor)throw Error('Missing gravity');r.S.wx=x;r.S.wy=y;r.ptr=null;r.keys.d=1;r.frame.l=1000;r.frame(1050);r.keys.d=0;if(Math.abs(r.S.wx-x-r.SPEED*factor*.05)>.001)throw Error('Gravity movement mismatch');r.showRegion(region,true);if(!document.getElementById('zDo').textContent.includes(gravityOf(region,r.seedOf).name))throw Error('Gravity label missing');}}finally{r.S.wx=oldX;r.S.wy=oldY;r.keys.d=0;r.frame.l=performance.now();window.requestAnimationFrame=oldRAF;}}''')
  page.locator('#bMenu').click();page.locator('#bAch').click()
  assert page.locator('#mJournal').is_visible()
  assert 'Gravedad' in page.locator('#journalBody').inner_text()
  page.locator('[data-journal-tab="forms"]').click()
  page.evaluate('''()=>{const r=window.__testRuntime;r.discover(r.regionOfPos(900,900).species[0]);}''')
  page.locator('[data-journal-tab="places"]').click();page.locator('[data-journal-tab="forms"]').click()
  assert 'Sin formas descubiertas' not in page.locator('#journalBody').inner_text()
  page.locator('[data-journal-tab="music"]').click();assert 'Instrumentos' in page.locator('#journalBody').inner_text()
  assert page.evaluate('Object.keys(window.__testRuntime.S.journal.music.instruments).length > 0')
  page.evaluate('''()=>{const r=window.__testRuntime,old=r.S.sound;r.S.sound=false;r.recordInstrument('muted-test');r.S.sound=old;if(r.S.journal.music.instruments['muted-test'])throw Error('Muted music incorrectly recorded');}''')
  page.locator('[data-journal-tab="achievements"]').click();assert '???' in page.locator('#journalBody').inner_text()
  page.locator('#journalClose').click()
  # Real pointer gestures: hold scans, drag moves, a short tap pulses.
  center={'x':size['width']/2,'y':size['height']/2}
  page.mouse.move(center['x']+60,center['y']);before=page.evaluate('({x:window.__testRuntime.S.wx,y:window.__testRuntime.S.wy,waves:window.__testRuntime.waves.length})')
  page.mouse.down();page.wait_for_timeout(650);assert page.locator('#scanner').is_visible();page.screenshot(path='/tmp/whitedot-scanner-'+label+'.png')
  after=page.evaluate('({x:window.__testRuntime.S.wx,y:window.__testRuntime.S.wy,waves:window.__testRuntime.waves.length})')
  assert abs(after['x']-before['x'])<.001 and abs(after['y']-before['y'])<.001
  page.mouse.up();assert not page.locator('#scanner').is_visible()
  page.wait_for_timeout(800);page.mouse.click(center['x'],center['y'])
  assert page.evaluate('window.__testRuntime.waves.length > 0')
  page.mouse.move(center['x'],center['y']);before=page.evaluate('window.__testRuntime.S.wx');page.mouse.down();page.mouse.move(center['x']+80,center['y']);page.wait_for_timeout(650)
  assert not page.locator('#scanner').is_visible();assert page.evaluate('window.__testRuntime.S.wx')>before;page.mouse.up()
  page.keyboard.down('e');assert page.locator('#scanner').is_visible();page.keyboard.up('e');assert not page.locator('#scanner').is_visible()
  if label=='mobile':
   cdp=c.new_cdp_session(page);cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[center]});page.wait_for_timeout(650);assert page.locator('#scanner').is_visible();cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});assert not page.locator('#scanner').is_visible()
  page.keyboard.press('Space')
  page.keyboard.down('d');page.wait_for_timeout(300);page.keyboard.up('d')
  page.locator('#bPrimary').click();page.locator('#bPrimary').click();assert page.locator('#reto').is_visible()
  page.locator('#bMenu').click();page.wait_for_timeout(2200);before=page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).lampUsed');page.wait_for_timeout(2200);after=page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).lampUsed');assert abs(after-before)<.1,(before,after)
  page.locator('#dNext').click();assert not page.locator('#reto').is_visible();assert not page.locator('#mCap').is_visible()
  page.wait_for_timeout(2100);assert page.evaluate('JSON.parse(localStorage.getItem("pixel-blanco-v4")).mode')=='camino'
  page.locator('#bMenu').click();page.locator('#bStudio').click();page.locator('#w').click(position={'x':size['width']/2,'y':size['height']/2-min(size['width'],size['height']-260)*.13});assert page.evaluate('Object.keys(JSON.parse(localStorage.getItem("pixel-blanco-v4")).studio.slots).length')==1
  page.locator('#stExit').click();page.reload(wait_until='domcontentloaded');page.wait_for_function('document.getElementById("bMenu").onclick !== null');assert page.evaluate('Object.keys(JSON.parse(localStorage.getItem("pixel-blanco-v4")).studio.slots).length')==1
  assert page.evaluate('Object.keys(JSON.parse(localStorage.getItem("pixel-blanco-v4")).journal.music.instruments).length > 0')
  page.locator('#bMenu').click();page.locator('#bShare').click();assert page.locator('#shareImg').evaluate('(i)=>i.naturalWidth>0');assert not errors,errors
  print(label+': challenges, day rollover, paused lamp, studio persistence, sharing PASS',flush=True);c.close()
 b.close()
server.shutdown()
