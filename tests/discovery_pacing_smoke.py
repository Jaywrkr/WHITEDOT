"""One encounter gets one notice; repeated powers stay brief without losing records."""
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
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=notice-pacing&layout=classic&generation=2');page.wait_for_function('!!window.__testRuntime?.collectRareCard');page.evaluate('''()=>{document.querySelectorAll('.modal').forEach(m=>m.hidden=true);const r=__testRuntime;r.S.sound=false;window.__noticeContext=r.ac;const create=r.ac.createOscillator.bind(r.ac);window.__noticeOsc=0;r.ac.createOscillator=(...args)=>{__noticeOsc++;return create(...args);};const o={id:'fixture:encounter',x:r.S.wx,y:r.S.wy};r.collectRareCard('fossil',o);r.collectRareCard('relic:magical',o);if(r.rareCards.length!==2||r.rareNoticeState.pending!==1)throw Error('coalescing lost records or duplicated notices');}''')
  page.wait_for_function('!document.getElementById("rareNotice").hidden');assert page.locator('#rareNoticeName').inner_text()=='Constelación dormida';page.locator('#rareNoticeDismiss').click();page.wait_for_function('document.getElementById("rareNotice").hidden')
  page.evaluate('''()=>{const r=__testRuntime;r.collectRareCard('fossil',{id:'fixture:repeat',x:r.S.wx+100,y:r.S.wy});}''');page.wait_for_function('!document.getElementById("rareNotice").hidden');assert page.locator('#rareNotice').get_attribute('data-repeat')=='true';assert 0<page.evaluate('__testRuntime.rareNoticeState.remaining')<=3;assert page.evaluate('__testRuntime.rareCards.length')==3;page.locator('#rareNoticeDismiss').click();page.wait_for_function('document.getElementById("rareNotice").hidden')
  page.evaluate('''()=>{const r=__testRuntime;r.S.ach.poder_cometa=r.S.todayKey;r.celebrateBox({id:'fixture:power',power:'cometa',x:r.S.wx,y:r.S.wy});}''');page.wait_for_function('!document.getElementById("celebration").hidden');assert page.locator('#celebrationTier').inner_text()=='Poder renovado · temporal';assert 0<page.evaluate('__testRuntime.celebrationState.remaining')<=2;page.locator('#celebrationDismiss').click();assert page.evaluate('document.activeElement.id')=='w';assert page.evaluate('__testRuntime.ac===window.__noticeContext&&window.__noticeOsc===0'),'presentation preserves audio context without emitting notes';assert not errors,errors
  print('PASS related findings coalesce without record loss, repeat notices shorten and UI stays silent with focus return');b.close()
finally:server.shutdown()
