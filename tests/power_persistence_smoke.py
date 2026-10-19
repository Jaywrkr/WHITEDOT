"""Powers keep active time across reload; a quiet gift is awarded once per region/day."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required']);page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.set_default_timeout(10000);page.on('pageerror',lambda e:(errors.append(str(e)),print(str(e),flush=True)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  url=f'http://127.0.0.1:{server.server_port}/?testSeed=power-persistence&layout=classic&generation=2&travel=1'
  page.goto(url);page.wait_for_function('window.__testRuntime?.quietState');page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)');page.mouse.click(20,250);page.wait_for_function('__testRuntime.ac?.state==="running"')
  quiet='''()=>{const r=__testRuntime,q=r.quietState,d=r.MU.dnaT;r.body.ready=true;r.body.speed=0;r.body.jump=false;q.anchor={x:r.S.wx,y:r.S.wy};q.key=d.key;q.seconds=199.5;q.stage=4;r.quietTick(1);return {id:r.S.giftBoxes.at(-1)?.id,count:r.S.giftBoxes.length,book:structuredClone(r.S.quietGifts)};}'''
  gift=page.evaluate(quiet);assert gift['count']==1 and len(gift['book'])==1,gift
  result=page.evaluate('''()=>{const r=__testRuntime;r.givePower('cometa');r.givePower('campo');r.givePower('companero','grulla');const frameSeconds=r.activeFrameSeconds;r.activeFrameSeconds=1;r.cajasTick(1);r.cajasTick(1);r.givePower('campo');if(r.powerFieldRadius()<169)throw Error('Stacked field collapsed');r.activeFrameSeconds=frameSeconds;r.save();return {left:r.powerSecondsLeft('cometa'),companion:r.powerSecondsLeft('companero')};}''');assert 17<=result['left']<=19,result
  page.locator('#bMenu').click();paused=page.evaluate('__testRuntime.powerSecondsLeft("cometa")');page.wait_for_timeout(500);assert page.evaluate('__testRuntime.powerSecondsLeft("cometa")')==paused
  page.reload();page.wait_for_function('!!window.__testRuntime?.powerSecondsLeft');assert abs(page.evaluate('__testRuntime.powerSecondsLeft("cometa")')-result['left'])<1.5
  assert abs(page.evaluate('__testRuntime.powerSecondsLeft("companero")')-result['companion'])<1.5;assert page.evaluate('__testRuntime.powerFieldRadius()')>169
  assert page.evaluate('__testRuntime.S.giftBoxes[0].id')==gift['id'];page.evaluate('document.querySelectorAll(".modal").forEach(m=>m.hidden=true)');page.mouse.click(20,250);page.wait_for_function('__testRuntime.ac?.state==="running"');again=page.evaluate(quiet);assert again['count']==1 and again['id']==gift['id'],again
  page.evaluate('()=>{const r=__testRuntime,b=r.S.giftBoxes[0];r.S.wx=b.x;r.S.wy=b.y;}');page.wait_for_function('__testRuntime.S.giftBoxes.length===0');page.reload();page.wait_for_function('window.__testRuntime?.S.giftBoxes');assert page.evaluate('__testRuntime.S.giftBoxes.length')==0;assert page.evaluate('Object.keys(__testRuntime.S.quietGifts).length')==1
  assert not errors,errors;print('PASS reload keeps remaining active powers, pauses menus, restores unclaimed gifts and prevents repeat daily quiet gifts');b.close()
finally:server.shutdown()
