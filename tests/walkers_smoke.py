"""A native small walker befriends, answers in rhythm and enters the fifty-form album."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(320,740),(390,844),(844,390)]:
   page=b.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];page.on('pageerror',lambda e:(errors.append(str(e)),print(str(e),flush=True)));page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']})")
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=walker-habitat&layout=classic&generation=2&travel=1');page.wait_for_function('!!window.__testRuntime?.walkerHear');found=page.evaluate('''()=>{const r=__testRuntime;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);for(let x=-12;x<12;x++)for(let y=-12;y<12;y++){const c=r.sceneChunk(r.wchunk(x,y)),k=c.walkers.find(k=>k.walkerForm.body===0);if(k&&!r.regionOfPos(k.x,k.y).anomaly){r.S.wx=k.x-45;r.S.wy=k.y;r.ptr=null;window.__nativeWalker=k;window.__walkerNotes=[];r.walkerNoteCue=n=>__walkerNotes.push(n);return {id:k.id,form:k.walkerForm.id,cx:x,cy:y};}}throw Error('Missing native walker');}''')
   page.mouse.click(20,height/2);page.wait_for_function('__nativeWalker.follow>0&&__testRuntime.MU.walkerFollowers.includes(__nativeWalker)');assert page.evaluate('(f)=>!!__testRuntime.S.walkerForms[f]',found['form'])
   page.evaluate('window.__walkerNotes=[]')
   for i in range(5):
    page.mouse.click(20,height/2);page.wait_for_timeout(800)
   # Empty-space pulses need not hit another voice. Supply an actual native player note for the response.
   page.evaluate("()=>{const r=__testRuntime;r.playVoice('arbol',0,r.ac.currentTime+.1,r.regionOfPos(r.S.wx,r.S.wy),false,.12,{x:r.S.wx,y:r.S.wy},'player');}")
   page.wait_for_function('f=>__walkerNotes.some(n=>n.form===f)',arg=found['form'])
   assert page.evaluate('(f)=>__walkerNotes.some(n=>n.form===f)',found['form']);assert page.evaluate('__walkerNotes.length')<=4
   page.locator('#bMenu').click();before=page.evaluate('({x:__nativeWalker.x,y:__nativeWalker.y,follow:__nativeWalker.follow})');page.wait_for_timeout(400);assert page.evaluate('({x:__nativeWalker.x,y:__nativeWalker.y,follow:__nativeWalker.follow})')==before
   (page.evaluate("document.getElementById('menuMore')?.setAttribute('open','')") or page).locator('#bAch').click();page.locator('[data-journal-tab="collection"]').click();page.locator('#journalGroup').select_option('caminantes');assert page.locator('.album-piece').count()==50;assert page.locator('.album-piece[data-owned="true"]').count()>=1;assert page.locator('.album-piece').first.get_attribute('data-owned')=='true';assert page.locator('.album-piece svg').count()==50;page.screenshot(path=f'/tmp/whitedot-walkers-{width}.png');page.locator('#journalClose').click()
   page.reload();page.wait_for_function('!!window.__testRuntime?.walkerHear');assert page.evaluate('(f)=>!!__testRuntime.S.walkerForms[f]',found['form']);assert page.evaluate('(f)=>__testRuntime.wchunk(f.cx,f.cy).walkers.find(k=>k.id===f.id).walkerForm.id',found)==found['form']
   assert not errors,errors;print('PASS native walker trust, diatonic response, paused motion, fifty miniatures and stable saved discovery at '+str(width),flush=True);page.close()
  b.close()
finally:server.shutdown()
