"""Panel 10, P4 · El cierre de la ronda: the card waits for the heard end of the drop, carries no achievement line, says
the gap near ★★ with «Otra vez» beside «Seguir hacia»; the live tick on the Line agrees with the card in ten rounds of
the Jardín; after the victory the objective and the gold column point to the place nearest its ★★."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,random,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
# Watches the drop's end on every frame and the heard audio time when the card opens.
WATCH='''()=>{const r=__r;window.__drop={end:null,heard:null,toasts:[]};const tick=()=>{const v=r.journeyVictoryState?.();if(v&&Number.isFinite(v.end))__drop.end=v.end;if(__drop.heard===null)requestAnimationFrame(tick);};requestAnimationFrame(tick);
 new MutationObserver(()=>{const m=document.getElementById('mPlace');if(!m.hidden&&__drop.heard===null){const ac=r.ac;__drop.heard=ac.currentTime-Math.max(0,Math.min(.4,Number(ac.outputLatency||ac.baseLatency||0)||0));}}).observe(document.getElementById('mPlace'),{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(()=>{const t=document.getElementById('toast')?.textContent||'';if(t)__drop.toasts.push(t);}).observe(document.getElementById('toast'),{childList:true,subtree:true,characterData:true});}'''
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  p.goto(f'http://127.0.0.1:{srv.server_port}/?lugar=jardin');p.wait_for_function('__r?.placeRun()?.id==="jardin"',timeout=20000)
  p.evaluate("()=>{__r.S.sound=true;__r.audio();document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}");p.wait_for_function("__r.ac?.state==='running'&&__r.MU?.sq?.length>0",timeout=20000)
  rng=random.Random(10)
  for n in range(10):
   total=rng.randint(40,160);share=rng.uniform(.6,.9);hits=[rng.random()<share for _ in range(total)]
   p.wait_for_function('!__r.rhythmDemo()',timeout=15000)  # Panel 11 (Q2): the round counts after the place sings.
   p.evaluate('''hits=>{for(const on of hits)__r.placeHear('jardin',on,{});}''',hits)
   tick=p.evaluate('__r.roundTick()')
   p.evaluate(WATCH)
   assert p.evaluate("__r.placeFinish('jardin')"),n
   p.wait_for_function('!document.getElementById("mPlace").hidden',timeout=15000)
   last=p.evaluate('__r.places().last');drop=p.evaluate('__drop')
   assert tick['lit']==last['stars'][1],(n,tick,last['onTime'])
   # The card never opens before the drop's end is heard.
   assert drop['end'] is not None and drop['heard']>=drop['end']-.005,(n,drop)
   rows=p.inner_text('#placeRows');assert 'logro' not in rows.lower() and p.locator('#placeNarrator').is_hidden(),(n,rows)
   assert not any('Logro' in t for t in drop['toasts']),(n,drop['toasts'])
   near=p.evaluate("document.getElementById('mPlace').hasAttribute('data-near')")
   collection=p.evaluate('__r.places().stars.jardin[1]')
   assert near==(not last['stars'][1] and not collection and .7<=last['onTime']<.75),(n,near,last['onTime'])
   if near:assert 'de ★★' in rows,rows
   p.locator('#placeAgain').click();p.wait_for_function('__r.placeRun()?.id==="jardin"')
  # What the rounds earned waits in the Bitácora.
  assert p.evaluate("document.getElementById('bAch').classList.contains('has-unread')")
  # The live tick is drawn: dark at the start of a round, gold once the share passes 75 %.
  p.wait_for_function('!__r.rhythmDemo()',timeout=15000)  # Panel 11 (Q2): the round counts after the place sings.
  p.evaluate("()=>{for(let i=0;i<8;i++)__r.placeHear('jardin',true,{});}");assert p.evaluate('__r.roundTick().lit')
  assert not errors,errors;p.close()
  # The near-miss card of the Lago: the exact gap, no achievement line, «Otra vez» beside «Seguir hacia».
  p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  p.goto(f'http://127.0.0.1:{srv.server_port}/?lugar=lago');p.wait_for_function('__r?.placeRun()?.id==="lago"',timeout=20000)
  p.evaluate("()=>{const r=__r;document.querySelectorAll('.modal').forEach(e=>e.hidden=true);r.S.sound=true;r.audio();r.S.lugares.stars.lago=[true,false,false];}");p.wait_for_function("__r.ac?.state==='running'&&!__r.rhythmDemo()",timeout=20000)
  p.evaluate("()=>{const r=__r;for(let i=0;i<500;i++)r.placeHear('lago',i<373,{});r.placeFinish('lago');}")
  p.wait_for_function('!document.getElementById("mPlace").hidden',timeout=15000)
  rows=p.inner_text('#placeRows');assert 'A 0,4 de ★★' in rows and 'logro' not in rows.lower(),rows
  a,nx=[p.locator(s).bounding_box() for s in ('#placeAgain','#placeNext')];assert abs(a['y']-nx['y'])<=2 and p.inner_text('#placeNext').startswith('Seguir hacia'),(a,nx)
  assert not errors,errors;p.close()
  # After the victory: the objective and the column point to the place without ★★ with the best share; 33 ★, explore.
  p=b.new_page(viewport={'width':390,'height':844});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
  p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
  p.evaluate("()=>{const d=__r.placesData();for(const id of Object.keys(d.stars))d.stars[id]=[true,false,false];d.best.lago={onTime:.746,ms:60000,rounds:1};d.best.faros={onTime:.5,ms:60000,rounds:1};document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}")
  assert p.evaluate('__r.ringState().next')=='lago',p.evaluate('__r.ringState()')
  p.evaluate("document.getElementById('bMenu').click()");p.wait_for_timeout(200)
  line=p.evaluate("document.querySelector('#bLugares small')?.textContent||''");assert 'Lago' in line and '74,6' in line,line
  assert p.inner_text('#bContinue')=='Seguir hacia Lago',p.inner_text('#bContinue')
  p.evaluate("()=>{const d=__r.placesData();for(const id of Object.keys(d.stars))d.stars[id]=[true,true,true];document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}")
  assert p.evaluate('__r.ringState().next') is None
  p.evaluate("document.getElementById('bMenu').click()");p.wait_for_timeout(200)
  line=p.evaluate("document.querySelector('#bLugares small')?.textContent||''");assert 'Explora a tu ritmo' in line,line
  assert not errors,errors;p.close()
  b.close()
 print('PASS round close: card after the heard drop in 10 Jardín rounds, live tick = card, no achievement line, near ★★ gap with «Otra vez» beside «Seguir hacia», objective and column after the victory, explore with 33 ★')
finally:srv.shutdown()
