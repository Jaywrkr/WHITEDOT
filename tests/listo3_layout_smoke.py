"""Listo 3 (alpha.275): the Bitácora's tabs never break inside a word, in Spanish and English, at 320, 360 and 390 px and
on a wide screen; the Refugio's first line is read whole, also in a narrow landscape band; the goal's line steps
aside while the scanner is held."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_port}/?abierto=1'
TABS="""()=>{const t=document.querySelector('.journal-tabs');return {over:t.scrollWidth>t.clientWidth,tabs:[...t.querySelectorAll('button')].map(b=>{const r=document.createRange();r.selectNodeContents(b);return {text:b.textContent,lines:r.getClientRects().length,cut:b.scrollWidth>b.clientWidth};})};}"""
def page(b,w,h,lang):
 p=b.new_page(viewport={'width':w,'height':h});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.add_init_script(f"try{{localStorage.setItem('kubono:lang','{lang}')}}catch(_){{}}")
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(URL);p.wait_for_function("!!window.__r?.ringState&&__r.inWorld()",timeout=30000);p.evaluate("()=>{document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);__r.S.sound=false;}")
 assert p.evaluate('__r.lang')==lang;p.errors=errors;return p
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for lang,names in [('es',['Hoy','Colección','Mapa','Música','Logros','Tú']),('en',['Today','Collection','Map','Music','Achievements','You'])]:
   for w,h in [(320,568),(360,640),(390,844),(1280,720)]:
    p=page(b,w,h,lang);p.evaluate("__r.openJournal('achievements')");p.wait_for_timeout(300)
    r=p.evaluate(TABS);assert [t['text'] for t in r['tabs']]==names,r
    assert not r['over'] and all(t['lines']==1 and not t['cut'] for t in r['tabs']),(lang,w,r)
    assert not p.errors,p.errors;p.close()
   # The Refugio's first line, whole: at 640×360 the side band is narrow and the English line takes three lines.
   for w,h in [(640,360),(1280,720),(320,568)]:
    p=page(b,w,h,lang);p.evaluate("()=>{__r.S.firstJourney.skipped=true;__r.landHouse();}")
    p.wait_for_function("document.getElementById('voice').classList.contains('on')&&document.getElementById('vX').textContent.length>40",timeout=15000);p.wait_for_timeout(700)
    v=p.evaluate("(x=>({text:x.textContent,sh:x.scrollHeight,ch:x.clientHeight}))(document.getElementById('vX'))")
    assert v['text'].endswith('.') and v['sh']<=v['ch']+1,(lang,w,v)
    assert not p.errors,p.errors;p.close()
  # While the finger is held the goal's line steps aside, as the notices do; it comes back when the finger lifts.
  p=page(b,360,640,'en');p.wait_for_function("!document.getElementById('ringRoute').hidden",timeout=8000)
  p.evaluate("__r.startScanner()");assert p.evaluate("getComputedStyle(document.getElementById('ringRoute')).opacity")=='0'
  p.evaluate("__r.stopScanner()");assert p.evaluate("getComputedStyle(document.getElementById('ringRoute')).opacity")=='1'
  assert not p.errors,p.errors;p.close()
  b.close()
  print('PASS Bitácora tabs whole in ES/EN at 320, 360, 390 and 1280 px; the Refugio line read whole at 640×360, 1280×720 and 320×568; the goal line steps aside while scanning',flush=True)
finally:server.shutdown()
