"""Phase 3 of the plan, coherence, in the real game on a phone: no visible text under 11 px, a notice never covers the
top-right counters, the menu's mode button reads in two lines, the Journal lists the rare moments and the superbiome
count can be completed, and the World's life speaks with names of the universe."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,re
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# Every element with its own visible text: its box and font size; and the pairs of such boxes that overlap.
TEXTS="""()=>{const els=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>.05&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&!e.closest('[hidden]')&&r.bottom>0&&r.top<innerHeight;});
 const box=e=>e.getBoundingClientRect(),hits=[];for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){const a=els[i],b=els[j];if(a.contains(b)||b.contains(a))continue;const p=box(a),q=box(b);if(p.left<q.right-1&&q.left<p.right-1&&p.top<q.bottom-1&&q.top<p.bottom-1)hits.push([a.id||a.className,b.id||b.className]);}
 return {small:els.filter(e=>parseFloat(getComputedStyle(e).fontSize)<11).map(e=>(e.id||e.className||e.tagName)+': '+e.textContent.trim().slice(0,30)),hits};}"""
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
  page.goto(f'http://127.0.0.1:{server.server_port}/');page.wait_for_function('!!window.__r?.enterWorld')
  hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
  page.evaluate("()=>{"+hide+";const r=__r,s=r.S;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});r.stopAutopilot?.();r.save();}")
  page.wait_for_timeout(1500);page.evaluate(hide)
  # An achievement notice in the free World: it appears, below «Próximo salto», and nothing on screen is under 11 px.
  page.evaluate("__r.unlock('tiempo')");page.wait_for_function("document.getElementById('toast').classList.contains('on')",timeout=8000);page.wait_for_timeout(400)
  t=page.evaluate(TEXTS);assert not t['small'],t['small'];assert not [h for h in t['hits'] if 'toast' in h],t['hits']
  goal=page.evaluate("(()=>{const r=document.getElementById('sparkGoal').getBoundingClientRect();return [r.height,getComputedStyle(document.getElementById('sparkGoal')).whiteSpace]})()");assert goal[1]=='nowrap',goal
  # The menu: the mode button's two lines, and «Mundo» and «Viajar a otra semilla» with different icons.
  page.evaluate(hide);page.locator('#bMenu').click();assert page.evaluate("getComputedStyle(document.querySelector('#bJourneyMode small')).display")=='block'
  assert page.evaluate("document.querySelector('#bWorld svg').innerHTML!==document.querySelector('#bWorlds svg').innerHTML")
  t=page.evaluate(TEXTS);assert not t['small'],t['small']
  # The Journal: the rare moments, seen by name, and a superbiome count that can be completed.
  page.evaluate("()=>{__r.$('mMenu').hidden=true;const u=(__r.S.universe||={});u.rare={...(u.rare||{}),lago:2};__r.openJournal('places');}");page.wait_for_selector('.rare-list')
  body=page.inner_text('#journalBody');assert re.search(r'Momentos raros · \d+/14',body) and 'Todas las fuentes' in body,body[-400:]
  assert re.search(r'Superbiomas · \d+/104',body),'the count leaves out the superbiome that never appears'
  # The World's life speaks with names of the universe.
  names=page.evaluate("Object.values(__r.VOZ).join(' ')+' '+__r.ACH.map(a=>a[1]+' '+a[2]).join(' ')")
  for word in ['Golondrina','Grulla','Ave lira','luciérnagas','No tienes alas','Disciplina','No fallé']:assert word not in names,word
  assert not errors,errors;browser.close()
 print('PASS coherence on a phone: no text under 11 px, notices below the counters, a two-line mode button and distinct icons, rare moments and a completable superbiome count in the Journal, universe names and no discipline phrases',flush=True)
finally:server.shutdown()
