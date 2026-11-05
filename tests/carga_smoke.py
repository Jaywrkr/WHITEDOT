"""T3 «la carga» (coherencia, decision 4 of Jay) · phone (390x844) and desktop (1280x800). The radar is always there
without boxes. Opening a Carga box (the old Brújula, power brujula) gives that power only (no surprise) and one notice
(«Carga · …»); for 20 s of play the Scanner is at its top level (4c) and one white arrow, in the one arrow layer, points
at the rarest thing the registry reaches (a test thing 900 m away, out of reach without the charge). Then the save's own
level comes back and the arrow goes."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil
ROOT=Path(__file__).resolve().parents[1]
SHOTS=os.environ.get('CARGA_SHOTS')
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
FREE="()=>{"+HIDE+";const r=__r;r.S.sound=false;r.stopAutopilot?.();if(r.journeyMode()!=='libre')r.setJourneyMode('libre');const d=r.placesData?.();if(d)d.seen={...(d.seen||{}),llanura:true};r.liveEncounterRest?.();r.save();}"
# One test thing, rarer than anything of the World, 900 m east of the cube: only the charge reaches it.
ENTRY="""async()=>{const M=await import('/src/scanner-model.js');if(!M.scanEntry('prueba-carga'))M.registerScan({id:'prueba-carga',name:'Lo más raro',shape:'sonda',level:1,rarity:3,sites:()=>window.__carga?[window.__carga]:[]});return true;}"""
PLACE="()=>{const r=__r;window.__carga={key:'lejos',x:r.S.wx+9000,y:r.S.wy};return true;}"
GO="(p)=>{const r=__r;r.S.wx=p.x;r.S.wy=p.y;if(r.body){r.body.x=r.body.px=p.x;r.body.y=r.body.py=p.y;}r.liveEncounterRest?.();}"
WHITE="""(shown)=>{const cv=document.getElementById('w'),c=cv.getContext('2d'),k=cv.width/cv.clientWidth,out=[];
 for(const e of shown){const x=Math.round((e.x-10)*k),y=Math.round((e.y-10)*k),n=Math.round(20*k),d=c.getImageData(Math.max(0,x),Math.max(0,y),n,n).data;let bright=0,worst=0;
  for(let i=0;i<d.length;i+=4){if(d[i]+d[i+1]+d[i+2]>600){bright++;worst=Math.max(worst,Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2]));}}out.push({key:e.key,bright,worst});}return out;}"""
def st(page):return page.evaluate("__r.edgeState()")
def hold(page,ms=650):
 w,h=page.viewport_size['width'],page.viewport_size['height'];page.mouse.move(w/2+70,h/2-90);page.mouse.down();page.wait_for_timeout(ms)
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?anillo=1');page.wait_for_function("!!window.__r?.edgeState&&!!window.__r?.spawnBox&&__r.ringState?.().active",timeout=90000)
   # Alpha.264: each trophy upgrades the radar; as a new player after the Llanura (one trophy), level 2 at 120 m.
   page.evaluate("()=>{__r.S.journey.done={llanura:true};const d=__r.placesData();for(const id of Object.keys(d.stars))if(id!=='llanura')d.stars[id]=[false,false,false];}")
   page.evaluate(FREE);page.wait_for_timeout(600);page.evaluate(FREE);page.evaluate(ENTRY)
   page.evaluate(GO,{'x':31000,'y':1234});page.evaluate("()=>{__r.S.lugares={...(__r.S.lugares||{}),won:false};}");page.evaluate(PLACE);page.wait_for_timeout(700);page.evaluate(HIDE)
   # --- 1 · Without a box the radar is there at the save's level (2 here); nothing points 900 m away.
   s=st(page);assert s['level']=='2' and not s['charged'] and s['pointer'] is None,s
   assert not any(e['kind']=='carga' for e in s['shown']),s
   hold(page);sc=page.evaluate("__r.scanState()");page.mouse.up();assert sc['scanning'] and sc['level']=='2' and not sc['charged'],sc
   page.wait_for_timeout(300);page.evaluate("()=>{__r.stopScanner?.();}")
   # --- 2 · A Carga box: its power only, one notice, the top level and one white arrow to the rarest.
   page.evaluate("()=>{const r=__r;"+HIDE+";r.clearPowers?.();if(r.S.ach)delete r.S.ach.poder_brujula;r.spawnBox(r.S.wx,r.S.wy,'brujula');}")
   page.wait_for_function("__r.hasPower('brujula')",timeout=8000)
   assert page.evaluate('__r.surpriseState.ids.length')==0;assert page.locator('#surpriseHud').is_hidden(),'no surprise'
   page.wait_for_function("!document.getElementById('celebration').hidden",timeout=8000)
   line=page.inner_text('#celebrationLine');assert line.startswith('Carga · '),line;assert page.locator('#celebrationSurpriseName').inner_text().strip()==''
   page.locator('#celebrationDismiss').click();page.wait_for_function("document.getElementById('celebration').hidden",timeout=5000)
   page.wait_for_function("__r.edgeState().pointer?.key==='scan:prueba-carga:lejos'",timeout=5000);page.wait_for_timeout(500)
   s=st(page);assert s['charged'] and s['level']=='4c',s
   mine=[e for e in s['shown'] if e['kind']=='carga'];assert len(mine)==1 and mine[0]['key']=='scan:prueba-carga:lejos' and mine[0]['label']=='900 m',s
   assert len(s['shown'])<=3,s
   for o in page.evaluate(WHITE,mine):
    assert o['bright']>0,('the arrow is drawn',o);assert o['worst']<=40,('only white, never gold',o)
   if SHOTS:page.screenshot(path=f'{SHOTS}/carga-{width}.png')
   hold(page,2400);sc=page.evaluate("__r.scanState()");page.mouse.up();assert sc['level']=='4c' and sc['charged'] and sc['reach']==12000,sc
   assert any(i['id']=='prueba-carga' for i in sc['items']),('the charged scanner reaches 900 m',sc['items'])
   # Escáner NMS: the far thing is a mark at the screen's edge, its icon and «Lo más raro · 900 m»; no panel.
   mk=[m for m in sc['marks'] if m['id']=='prueba-carga'];assert mk and mk[0]['edge'] and mk[0]['label']=='Lo más raro · 900 m' and mk[0]['shape']=='sonda',sc['marks']
   assert not page.locator('#scanner').is_visible()
   page.wait_for_timeout(300);page.evaluate("()=>{__r.stopScanner?.();}");page.evaluate(HIDE)
   # --- 3 · After 20 s of play the charge ends: the save's level comes back and the arrow goes.
   left=page.evaluate("__r.powerSecondsLeft('brujula')");assert 0<left<=20,left
   page.wait_for_function("!__r.hasPower('brujula')",timeout=40000);page.wait_for_timeout(600)
   s=st(page);assert not s['charged'] and s['level']=='2' and s['pointer'] is None,s;assert not any(e['kind']=='carga' for e in s['shown']),s
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors
   print(f'PASS la carga at {width}x{height}: radar at level 2 without a box, a Carga box gives its power only, 4c for 20 s and one white arrow to the rarest (900 m), then level 2 again',flush=True)
   page.close()
  browser.close()
finally:server.shutdown()
