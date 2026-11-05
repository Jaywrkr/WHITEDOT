"""Los lugares te encuentran (Jay, 5 Nov 2026, alpha.264), on phone and desktop. A new player after the Llanura (the
one-place Journey) walks in each of four directions: before the Lago's portal exists, the line under the HUD says it is
farther, at 1 km; crossing 1 km on foot fixes its portal ahead, on the heading, at its distance, and saves it; the edge
layer points at it with the «lugar» icon; walking in and winning its round upgrades the radar. Since alpha.269 there is
no ring: an advanced save has its won places at their distance on their old ring angle (version 4), also after a
migration from version 2, and the rest wait to be found."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,math
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
KEYS={(1,0):'ArrowRight',(-1,0):'ArrowLeft',(0,1):'ArrowDown',(0,-1):'ArrowUp'}
RADAR="async()=>{const M=await import('/src/scanner-model.js');const L=M.scanLevel(__r.S);return {id:L.id,reach:L.reach};}"
def page_for(browser,width,height,url):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(url);page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
 page.evaluate("()=>{__r.S.sound=false;__r.stopAutopilot?.();document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);}")
 return page,errors
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  base=f'http://127.0.0.1:{server.server_port}/'
  for width,height in [(390,844),(1280,800)]:
   for (hx,hy),key in KEYS.items():
    page,errors=page_for(browser,width,height,base+'?anillo=1&lejos=1')
    # After the Llanura (the test save): its trophy, its portal at 0,5 km (the old Journey's chapter, moved there).
    page.evaluate("()=>{const j=__r.S.journey;j.done={llanura:true};const d=__r.placesData();for(const id of Object.keys(d.stars))if(id!=='llanura')d.stars[id]=[false,false,false];d.found={};d.moved={};__r.save();}")
    st=page.evaluate('__r.ringState()');assert [s['id'] for s in st['spots']]==['llanura'],st
    assert st['hint']=={'id':'lago','name':'Lago','km':1},st['hint']
    before=page.evaluate(RADAR);assert before=={'id':'2','reach':120},before
    # Near 1 km, not past it: still only «más lejos».
    page.evaluate(f"()=>{{__r.S.wx={hx*9700};__r.S.wy={hy*9700};}}");page.wait_for_function("!document.getElementById('ringRoute').hidden",timeout=5000)
    page.wait_for_timeout(200);line=page.inner_text('#ringRoute');assert 'Lago' in line and 'más lejos' in line and '1 km' in line,line
    assert not page.evaluate('__r.S.lugares.found.lago')
    # Walk on with the keyboard until the Lago finds you.
    page.locator('#w').focus();page.keyboard.down(key)
    page.wait_for_function("!!__r.S.lugares.found.lago",timeout=20000);page.keyboard.up(key)
    f=page.evaluate('__r.S.lugares.found.lago');x,y=page.evaluate('[__r.S.wx,__r.S.wy]')
    assert (f['x']-x)*hx+(f['y']-y)*hy>1000,('ahead on the heading',f,x,y)
    r=math.hypot(f['x'],f['y']);assert 10000<=r<=10000+1500+1900,('at its distance',r)
    assert page.evaluate("JSON.parse(localStorage.getItem('kubono:lugar')||'null')?.lugares?.found?.lago")==f,'saved'
    # The edge layer points at it, with the «lugar» icon, on its side.
    page.wait_for_function("__r.edgeState().shown.some(e=>e.kind==='lugar')",timeout=5000)
    arrow=next(e for e in page.evaluate('__r.edgeState().shown') if e['kind']=='lugar');assert arrow['shape']=='lugar' and arrow['key']=='lugar:lago',arrow
    if hx:assert (arrow['x']-width/2)*hx>0,arrow
    else:assert (arrow['y']-height/2)*hy>0,arrow
    assert page.evaluate('__r.ringState().next')=='lago' and page.evaluate('__r.ringRoute().id')=='lago'
    # Walk in: its round; win it: the radar reaches farther.
    page.evaluate(f"()=>{{__r.S.wx={f['x']-hx*90};__r.S.wy={f['y']-hy*90};}}");page.wait_for_timeout(200);page.keyboard.down(key)
    page.wait_for_function("__r.places().run?.id==='lago'",timeout=10000);page.keyboard.up(key)
    assert page.evaluate("__r.placeFinish('lago')");after=page.evaluate(RADAR);assert after['reach']>before['reach'],(before,after)
    page.wait_for_function("!__r.places().run",timeout=5000);assert page.evaluate("__r.S.lugares.stars.lago[0]")
    assert page.evaluate("__r.ringState().hint")=={'id':'bosque','name':'Bosque','km':2}
    # A reload keeps the portal where it was found.
    page.reload();page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
    assert page.evaluate('__r.S.lugares.found.lago')==f and 'lago' not in page.evaluate('__r.ringState().moved')
    assert not errors,errors;page.close()
   # An advanced save (the five chapters of the old Journey, then the Jardín won on the ring at version 2): every won place
   # is at its distance on its old ring angle (version 4, legacySpot), never on a ring; the Dunas wait, 12 km out.
   page,errors=page_for(browser,width,height,base+'?anillo=1&lejos=1')
   LEGACY="async(ids)=>{const M=await import('/src/places.js');const sea=(x,y)=>!!__r.regionOfPos?.(x,y)?.sea;return Object.fromEntries(ids.map(id=>[id,M.legacySpot(id,sea)]));}"
   five=['llanura','lago','bosque','tormenta','vacio'];old=page.evaluate(LEGACY,five+['jardin'])
   st=page.evaluate('__r.ringState()');assert [s['id'] for s in st['spots']]==five,st['spots']
   for s in st['spots']:assert (s['x'],s['y'])==(old[s['id']]['x'],old[s['id']]['y']),s
   page.evaluate("()=>{const d=__r.S.lugares;d.version=2;d.stars.jardin=[true,true,false];delete d.found;delete d.moved;__r.save();}")
   page.reload();page.wait_for_function("!!window.__r?.ringState&&__r.ringState().active",timeout=20000)
   st=page.evaluate('__r.ringState()');assert page.evaluate('__r.S.lugares.version')==4
   assert [s['id'] for s in st['spots']]==five+['jardin'],st['spots']
   for s in st['spots']:assert (s['x'],s['y'])==(old[s['id']]['x'],old[s['id']]['y']),s
   assert page.evaluate('__r.S.lugares.stars.jardin')==[True,True,False] and 'center' not in st and page.evaluate('__r.S.lugares.ring') is None
   assert st['hint']=={'id':'dunas','name':'Dunas','km':12},st['hint']
   assert page.evaluate(RADAR)=={'id':'3','reach':215},'six trophies: level 3, a little farther'
   assert not errors,errors;page.close()
  browser.close()
 print('PASS los lugares te encuentran on phone and desktop: after the Llanura, walking in four directions the Lago appears ahead at 1 km and is saved, «más lejos · 1 km» before, the «lugar» arrow points at it, winning it upgrades the radar; an advanced save has its won places at their distance on their old ring angle, also from version 2, no ring',flush=True)
finally:server.shutdown()
