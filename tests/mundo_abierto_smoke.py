"""Directo mundo abierto (Jay, 5 Nov 2026, alpha.269), on phone and desktop. A new save starts in the open World: no
Camino, no Journey, no ring of portals, the radar at level 1, Lugares with the eleven places «más lejos». Walking out
from the start, the Llanura's portal appears ahead at 0,5 km and is saved; the edge layer points at it. A save in the
middle of the Journey lands in the open World with its chapter kept. An advanced save (version 3, six places won on the
old ring) keeps every star, record and note, and its won places stand at their distance on their old ring angle.
Automated browsers keep their old start, so this test asks for the player's one with «?abierto=1»."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,math,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
KEY='pixel-blanco-v4'
RADAR="async()=>{const M=await import('/src/scanner-model.js');const L=M.scanLevel(__r.S);return {id:L.id,reach:L.reach};}"
LEGACY="async(ids)=>{const M=await import('/src/places.js');const sea=(x,y)=>!!__r.regionOfPos?.(x,y)?.sea;return Object.fromEntries(ids.map(id=>[id,M.legacySpot(id,sea)]));}"
HIDE="()=>{__r.S.sound=false;__r.stopAutopilot?.();document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true);}"
READY="!!window.__r?.ringState&&__r.inWorld()&&__r.ringState().active"
def page_for(browser,width,height,url):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page.goto(url);page.wait_for_function(READY,timeout=20000)
 return page,errors
def lugares(page):
 page.evaluate("__r.openLugares()");page.wait_for_function("!document.getElementById('mLugares').hidden",timeout=3000)
 rows=page.evaluate("[...document.querySelectorAll('#lugaresList li')].map(li=>({id:li.dataset.placeId,note:li.querySelector('small')?.textContent||'',stars:li.querySelectorAll('.lugar-stars .got').length}))")
 ring=page.evaluate("(()=>{const b=document.getElementById('lugaresRing');return !!b&&b.hidden&&!b.offsetParent})()")
 page.evaluate("document.getElementById('mLugares').hidden=true");return rows,ring
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  base=f'http://127.0.0.1:{server.server_port}/?abierto=1'
  for width,height in [(390,844),(1280,800)]:
   # --- 1 · A new save: straight into the open World.
   page,errors=page_for(browser,width,height,base)
   st=page.evaluate("({mode:__r.S.mode,view:__r.journeyMode(),j:__r.S.journey,quiet:document.body.classList.contains('journey-quiet'),spots:__r.ringState().spots,hint:__r.ringState().hint,v:__r.S.lugares.version})")
   assert st['mode']=='world' and st['view']=='libre' and not st['quiet'],st
   assert st['j']['open'] is True and st['j']['freeGiven'] is True and st['j']['free'] is True and not st['j'].get('finished'),st['j']
   assert st['spots']==[] and st['v']==4,'no portal and no ring before walking'
   assert st['hint']=={'id':'llanura','name':'Llanura','km':0.5},st['hint']
   assert page.evaluate(RADAR)=={'id':'1','reach':40},'the radar at its weakest level'
   assert page.locator('#mHelpW').is_hidden() and page.locator('#mHelpC').is_hidden(),'no window first'
   page.evaluate(HIDE)
   assert page.evaluate("Object.keys(__r.S.lugares).includes('ring')||Object.keys(__r.S.lugares).includes('center')") is False
   rows,ring=lugares(page);assert ring,'#lugaresRing stays hidden'
   assert [r['id'] for r in rows][:2]==['llanura','lago'] and rows[0]['note']=='Más lejos · 0,5 km' and rows[10]['note']=='Más lejos · 40 km',rows
   page.wait_for_function("!document.getElementById('ringRoute').hidden",timeout=5000);line=page.inner_text('#ringRoute')
   line=page.evaluate("document.getElementById('ringRoute').textContent");assert line=='Llanura · más lejos · 0,5 km',line
   page.screenshot(path=str(Path('/tmp')/f'kubono-abierto-{width}.png'))
   # Walk out from the start, to the east, until the Llanura finds you.
   page.evaluate("()=>{__r.S.wx=4700;__r.S.wy=0;}");page.wait_for_timeout(200)
   page.locator('#w').focus();page.keyboard.down('ArrowRight')
   page.wait_for_function("!!__r.S.lugares.found.llanura",timeout=20000);page.keyboard.up('ArrowRight')
   f=page.evaluate('__r.S.lugares.found.llanura');x,y=page.evaluate('[__r.S.wx,__r.S.wy]')
   assert f['x']-x>1000,('ahead of the cube, on the heading',f,x,y);r=math.hypot(f['x'],f['y']);assert 5000<=r<=5000+1500+1900,('at 0,5 km',r)
   saved=json.loads(page.evaluate(f"localStorage.getItem('{KEY}')"));assert saved['lugares']['found']['llanura']==f,'saved'
   page.wait_for_function("__r.edgeState().shown.some(e=>e.kind==='lugar')||Math.hypot(__r.S.lugares.found.llanura.x-__r.S.wx,__r.S.lugares.found.llanura.y-__r.S.wy)<600",timeout=5000)
   assert page.evaluate('__r.ringState().next')=='llanura'
   page.reload();page.wait_for_function(READY,timeout=20000)
   assert page.evaluate('__r.S.lugares.found.llanura')==f and page.evaluate('__r.S.mode')=='world','kept on reload, still in the World'
   assert not errors,errors;page.close()
   # --- 2 · A save in the middle of the Journey (never in the World): into the open World, its chapter kept.
   page,errors=page_for(browser,width,height,base)
   page.evaluate("()=>{const S=__r.S;S.mode='camino';delete S.lastWorldDay;S.lastWorldDay=null;if(S.ach)delete S.ach.mundo;S.journey={version:1,mode:'viaje',free:false,chapter:2,done:{llanura:true},notes:{llanura:[57,60]},steps:{},ticks:{},progress:{},colors:{llanura:true}};const d=S.lugares;d.version=2;d.stars.llanura=[true,true,false];delete d.found;delete d.moved;__r.save();}")
   page.reload();page.wait_for_function(READY,timeout=20000)
   j=page.evaluate('__r.S.journey');assert j['free'] and j['open'] and j['freeGiven'] and j['mode']=='libre',j
   assert j['done']=={'llanura':True} and j['notes']['llanura']==[57,60] and j['chapter']==2,j
   assert page.evaluate("__r.S.mode")=='world' and page.evaluate("__r.S.lugares.stars.llanura")==[True,True,False]
   old=page.evaluate(LEGACY,['llanura']);assert page.evaluate("__r.S.lugares.found.llanura")==old['llanura'],'its chapter at 0,5 km'
   assert page.evaluate(RADAR)['id']=='2','one trophy: level 2'
   assert page.evaluate("__r.ringState().hint")=={'id':'lago','name':'Lago','km':1}
   assert not errors,errors;page.close()
   # --- 3 · An advanced save (version 3): six places won on the old ring, one found by distance, records and notes.
   page,errors=page_for(browser,width,height,base)
   six=['llanura','lago','bosque','tormenta','vacio','jardin']
   page.evaluate("""(six)=>{const S=__r.S;S.journey={version:1,mode:'libre',free:true,finished:true,chapter:6,done:{llanura:true,lago:true,bosque:true,tormenta:true,vacio:true},notes:{},steps:{},ticks:{},progress:{},freeJumpUsed:true};
    const stars={};for(const id of ['llanura','lago','bosque','tormenta','vacio','jardin','dunas','cristales','faros','ruinas','cueva'])stars[id]=[false,false,false];for(const id of six)stars[id]=[true,true,id==='jardin'];stars.dunas=[true,false,false];
    S.lugares={version:3,stars,best:{jardin:{onTime:.82,ms:95000,rounds:5},dunas:{onTime:.6,ms:120000,rounds:1}},rounds:{day:'',counts:{}},journeyShare:{},center:{x:2000,y:-1500},ringFixed:true,seen:{jardin:true,dunas:true,cristales:true},kept:{},
     ring:Object.fromEntries(six.map(id=>[id,true])),found:{dunas:{x:90000,y:80000}},notes:{jardin:[60,62,64]},noteSteps:{},noteTicks:{},won:false,master:false,credited:false,run:null};__r.save();}""",six)
   page.reload();page.wait_for_function(READY,timeout=20000)
   d=page.evaluate('__r.S.lugares');assert d['version']==4 and 'ring' not in d and 'center' not in d and 'ringFixed' not in d,d.keys()
   for id in six:assert d['stars'][id][:2]==[True,True],id
   assert d['stars']['jardin'][2] and d['stars']['dunas']==[True,False,False] and d['best']['jardin']['onTime']==0.82 and d['notes']['jardin']==[60,62,64] and d['seen']['cristales']
   old=page.evaluate(LEGACY,six)
   for id in six:assert d['found'][id]==old[id] and d['moved'][id],(id,d['found'].get(id),old[id])
   assert d['found']['dunas']=={'x':90000,'y':80000},'a place found by distance stays where it was found'
   st=page.evaluate('__r.ringState()');assert [s['id'] for s in st['spots']]==six+['dunas'] and 'center' not in st
   for s in st['spots']:
    if s['id'] in six:assert abs(math.hypot(s['x'],s['y'])-{'llanura':5000,'lago':10000,'bosque':20000,'tormenta':30000,'vacio':50000,'jardin':80000}[s['id']])<=1900,s
   assert st['hint']=={'id':'cristales','name':'Cristales','km':17},st['hint']
   assert page.evaluate(RADAR)=={'id':'3','reach':230},'seven trophies: level 3'
   assert page.evaluate("__r.S.journey.freeJumpUsed") is True and page.evaluate("__r.journeyMode()")=='libre'
   page.evaluate(HIDE);rows,ring=lugares(page);assert ring
   got={r['id']:r['stars'] for r in rows};assert got['jardin']==3 and got['llanura']==2 and got['dunas']==1 and got['cristales']==0,got
   assert next(r for r in rows if r['id']=='cristales')['note']=='Más lejos · 17 km'
   # Its won places are revisitable: travel to one, beside its portal.
   assert page.evaluate("__r.ringTravel('jardin')");p=page.evaluate("({x:__r.S.wx,y:__r.S.wy})");assert math.hypot(p['x']-old['jardin']['x'],p['y']-old['jardin']['y'])<200,p
   page.screenshot(path=str(Path('/tmp')/f'kubono-abierto-avanzado-{width}.png'))
   assert not errors,errors;page.close()
  browser.close()
 print('PASS directo mundo abierto on phone and desktop: a new save starts in the open World with no ring and the radar at level 1, the Llanura appears ahead at 0,5 km and is saved; a mid-Journey save lands in the World with its chapter; an advanced version-3 save keeps every star, record and note with its won places at their distance on their old angle, revisitable',flush=True)
finally:server.shutdown()
