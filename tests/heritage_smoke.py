"""Recovered relics remain playable without duplicating earned progress."""
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
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=heritage-return&layout=wide');page.wait_for_function('__testRuntime?.worldIdentity')
  page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)')
  result=page.evaluate('''async()=>{const r=__testRuntime,{relicAt}=await import('/src/relics.js');let site;for(let x=3;x<400&&!site;x++)for(let y=1;y<4&&!site;y++){const s=relicAt(x,y,r.WCH,r.seedOf,r.rng);if(s&&!r.regionOfPos(s.x,s.y).sea)site=s;}if(!site)throw Error('Missing site');
   r.S.wx=site.x;r.S.wy=site.y;r.audio();for(let i=0;i<260;i++)r.visitRelic(site,.05,i<5);window.__relic=site;window.__heard=[];r.foregroundNoteCue=n=>__heard.push(n);return {id:site.id,x:site.x,y:site.y,stars:r.S.stars.length};}''')
  assert result['stars']==1
  assert page.evaluate('__testRuntime.recoveredRelics().some(o=>o.id===__relic.id)')
  page.evaluate('''()=>{const r=__testRuntime;r.S.wx=__relic.x+100;r.relicEchoTick();r.S.wx=__relic.x;r.relicEchoTick();}''')
  page.wait_for_function('__heard.some(n=>n.source===__relic.id)');assert page.evaluate('__testRuntime.S.stars.length')==1
  page.screenshot(path='/tmp/whitedot-f7-relic-return.png');page.evaluate('__testRuntime.save()');page.reload();page.wait_for_function('__testRuntime?.worldIdentity')
  assert page.evaluate('(id)=>!!__testRuntime.S.relicSites[id]',result['id'])
  assert page.evaluate('__testRuntime.S.stars.length')==1
  assert not errors,errors;print('PASS actual relic awakening, playable recovered location, source onset, reload and no duplicated rewards',flush=True);b.close()
finally:server.shutdown()
