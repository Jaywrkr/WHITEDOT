"""Living collection in the dollhouse: rare cards framed, trophies by category, bought pieces in showcases, creatures and pet visiting, a pulse makes them hop; looking never changes the save."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(1280,800)]:
   page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=house-collection&layout=wide&generation=2');page.wait_for_function('!!window.__r?.enterHouse&&!!window.__r?.drawHouseCollection')
   hide="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
   page.evaluate("""()=>{"""+hide+""";const r=__r,s=r.S;s.sound=false;s.totalDays=14;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);r.enterWorld({automatic:true});s.rareBook={version:1,items:[]};
    for(const [i,t]of ['fossil','relic:magical','fossil'].entries())r.collectRareCard(t,{id:'hc:'+i,x:s.wx+300+i,y:s.wy},{context:{role:'perc',instrument:'woodblock'}});
    s.livingSeen={...(s.livingSeen||{}),moth:true,deer:true};s.sparks=900;s.sparkEconomy.earned=s.sparkEconomy.spent+900;for(const id of ['acc:hat','pet:cloud'])r.buySparkStyle(id);r.save();}""")
   page.evaluate("()=>{"+hide+";__r.enterHouse();}");page.wait_for_function('__r.houseSettled()');page.wait_for_timeout(500)
   before=page.evaluate("JSON.stringify({book:__r.S.rareBook,economy:__r.sparkEconomy,objects:__r.S.house.objects})")
   state=page.evaluate('__r.houseCollectionState()');assert state['hits']>=4+7,state
   assert {c['id'] for c in state['creatures']}=={'deer','moth'},state
   # Frames hold real portraits once loaded; tapping one names it instead of walking.
   page.wait_for_function("(()=>{const r=__r;return r.rareCards.length===3})()")
   look=page.evaluate("""()=>{const r=__r,rect=r.houseRoomRect('sala');for(let y=rect.y-40;y<rect.y+rect.h;y+=4)for(let x=rect.x;x<rect.x+rect.w;x+=4){const t=r.houseCollectionLook(x,y);if(t&&/Raro|Singular|Legendario|Mítico/.test(t))return {x,y,t};}return null;}""")
   assert look,'a framed card can be looked at'
   page.evaluate(hide);fx=page.evaluate('__r.houseStand().fx');page.locator('#w').click(force=True,position={'x':look['x'],'y':look['y']});page.wait_for_timeout(300)
   assert page.evaluate('__r.houseStand().target')==False and abs(page.evaluate('__r.houseStand().fx')-fx)<1,'looking does not walk'
   page.wait_for_function("document.getElementById('toast').textContent.length>0")
   # Trophies name their category and count.
   cup=page.evaluate("""()=>{const r=__r,rect=r.houseRoomRect('sala');for(let y=rect.y-40;y<rect.y+rect.h;y+=3)for(let x=rect.x;x<rect.x+rect.w;x+=3){const t=r.houseCollectionLook(x,y);if(t&&/logros$/.test(t))return t;}return null;}""")
   assert cup and ' de ' in cup,cup
   # Showcases in the basement show what was bought.
   page.evaluate("__r.houseWalkTo('sotano',.5)");page.wait_for_function("__r.houseStand().room==='sotano'&&__r.houseSettled()",timeout=15000)
   shown=page.evaluate("""()=>{const r=__r,rect=r.houseRoomRect('sotano'),out=new Set();for(let y=rect.y;y<rect.y+rect.h+20;y+=4)for(let x=0;x<innerWidth;x+=4){const t=r.houseCollectionLook(x,y);if(t&&t.endsWith('comprada en la tienda'))out.add(t);}return [...out];}""")
   assert any('Gorrito' in t for t in shown) and any('Nube' in t for t in shown),shown
   # A pulse makes nearby creatures hop: the deer lifts off the Sala floor for a moment.
   page.evaluate("__r.houseWalkTo('sala',.5)");page.wait_for_function("__r.houseStand().room==='sala'&&__r.houseSettled()",timeout=15000)
   page.evaluate("()=>{const r=__r,c=r.houseCollectionState().creatures.find(c=>c.id==='deer');window.__ring0=performance.now();r.housePulse();}")
   page.wait_for_timeout(150);page.screenshot(path=f'/tmp/kubono-house-collection-{width}.png')
   after=page.evaluate("JSON.stringify({book:__r.S.rareBook,economy:__r.sparkEconomy,objects:__r.S.house.objects})")
   assert after==before,'looking never changes the save'
   assert not errors,errors;page.close()
  browser.close()
 print('PASS living collection on phone and desktop: framed rare cards, trophies by category, showcases with bought pieces, visiting creatures, pulse, looking without walking or changing the save',flush=True)
finally:server.shutdown()
