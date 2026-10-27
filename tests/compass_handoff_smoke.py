"""K7: the compass cannot obstruct controls; all real finale exits open the free World."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading,json
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
OUT=Path(os.environ.get('COMPASS_EVIDENCE','/tmp/kubono-k7'));OUT.mkdir(parents=True,exist_ok=True)
rows=[]
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--no-proxy-server','--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
  def opened(width,height):
   p=b.new_page(viewport={'width':width,'height':height},has_touch=True);errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['es-ES']})")
   p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   p.goto(f'http://kubono.localhost:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.ringRoute&&__r.inWorld()')
   p.evaluate("()=>{__r.setJourneyMode('libre');__r.stopAutopilot?.();"+HIDE+";}")
   return p,errors
  for W,H in [(320,568),(390,844),(844,390),(1280,800)]:
   p,errors=opened(W,H);p.evaluate("__r.S.sound=false;__r.ringGuide('jardin')");p.wait_for_function('!document.getElementById("ringRoute").hidden')
   # An enlarged text sample too: the compass is a visual hint, never another touch target.
   for large in [False,True]:
    if large:p.locator('#ringRoute').evaluate("e=>e.style.fontSize='22px'")
    measured=p.evaluate("""()=>{const e=document.getElementById('ringRoute'),r=e.getBoundingClientRect(),over=[...document.querySelectorAll('button')].filter(b=>{const q=b.getBoundingClientRect(),s=getComputedStyle(b);return q.width&&q.height&&!b.closest('[hidden]')&&s.visibility!=='hidden'&&q.left<r.right&&q.right>r.left&&q.top<r.bottom&&q.bottom>r.top;});return {rect:{x:r.x,y:r.y,width:r.width,height:r.height},text:e.textContent,pointer:getComputedStyle(e).pointerEvents,overlap:over.map(b=>b.id),hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.id};}""")
    assert measured['overlap']==[],measured
    assert measured['pointer']=='none' and measured['hit']!='ringRoute',measured
    assert measured['rect']['y']>20 and measured['rect']['y']+measured['rect']['height']<H/2-40,measured
    rows.append({'viewport':[W,H],'doubleText':large,**measured})
   p.locator('#ringRoute').evaluate("e=>e.style.fontSize=''")
   before=p.evaluate('[__r.S.wx,__r.S.wy,__r.S.sparks]');p.locator('#w').focus();p.keyboard.down('ArrowRight');p.wait_for_timeout(600);p.keyboard.up('ArrowRight')
   assert p.evaluate('__r.S.wx')>before[0],'guidance cannot intercept real movement'
   assert p.evaluate('__r.S.sparks')==before[2]
   # A chosen favorite/house owns navigation; following the ring cancels it explicitly.
   p.evaluate("()=>{const c=__r.ringState().center;__r.S.studio.x=c.x;__r.S.studio.y=c.y;}")
   assert p.evaluate("__r.selectDestination('studio')")
   p.wait_for_function('document.getElementById("ringRoute").hidden');assert p.evaluate('__r.ringRoute()') is None
   assert p.evaluate("__r.ringGuide('jardin')");p.wait_for_function('!document.getElementById("ringRoute").hidden');assert p.evaluate('__r.S.destination') is None
   p.screenshot(path=str(OUT/f'compass-{W}.png'));assert not errors,errors;p.close()
  # Exercise all exits with the actual sound engine and house; shortened saved phrase, not shortened product timing.
  for how in ['automatic','skip','button']:
   p,errors=opened(390,844)
   p.evaluate("()=>{const r=__r;"+HIDE+";r.S.sound=true;r.audio();const j=r.S.journey;j.finished=false;j.mode='viaje';j.chapter=6;j.notes={llanura:[57,60]};r.applyJourneyMode();r.journeyFinale();}")
   p.wait_for_function('__r.ac?.state==="running"&&__r.journeyFinaleState().running')
   assert p.evaluate('__r.S.mode')=='studio' and p.evaluate('__r.houseActive()')
   if how=='skip':p.wait_for_timeout(2300);p.locator('#journeyFinale canvas').click(position={'x':20,'y':20})
   elif how=='button':p.wait_for_function('__r.journeyFinaleState().credits',timeout=30000);p.locator('#journeyExplore').click()
   p.wait_for_function('!__r.journeyFinaleState().running',timeout=35000)
   p.wait_for_function('__r.inWorld()&&__r.S.mode==="world"&&!__r.houseActive()&&__r.ringRoute()?.id==="jardin"')
   assert p.evaluate('__r.S.journey.finished&&__r.journeyMode()==="libre"')
   assert p.evaluate('__r.S.lugares.stars.llanura[0]&&__r.S.lugares.stars.vacio[0]')
   last=p.evaluate('__r.MU.bq.at(-1)||0');p.wait_for_function('(__r.MU.bq.at(-1)||0)>%s'%last,timeout=8000)
   rows.append({'exit':how,'world':True,'house':False,'next':'jardin','audioResumed':True})
   assert not errors,errors;p.close()
  b.close()
 (OUT/'verification.json').write_text(json.dumps({'scope':'Local production-appearance fixtures, real keyboard/audio/house; no human listening','checks':rows},indent=2)+'\n')
 print('PASS K7: compass/controls at four viewports and doubled text, real movement, one navigation target, three sound-on finale exits to World/Jardin',flush=True)
finally:srv.shutdown();srv.server_close()
