"""Real family places in World, mobile rendering, coherent sources and address return."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json,hashlib
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  page=b.new_page(viewport={'width':390,'height':844},has_touch=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
  base=f'http://127.0.0.1:{server.server_port}/'
  page.goto(base+'?testSeed=laboratorio&layout=wide&generation=2&lab=1');page.wait_for_function('__testRuntime?.labMode')
  ids=page.evaluate('import("/src/world-families.js").then(m=>m.WORLD_FAMILIES.map(f=>f.id))');rows=[];images=set()
  for family in ids:
   page.evaluate('''id=>{document.querySelectorAll('.modal').forEach(m=>m.hidden=true);__testRuntime.labGo('landscape:'+id);}''',family)
   page.wait_for_function('(id)=>__testRuntime.regionOfPos(__testRuntime.S.wx,__testRuntime.S.wy).worldFamily.id===id',arg=family)
   address=page.evaluate('''async()=>{const r=__testRuntime,{placeAddress}=await import('/src/world-identity.js'),{encodePlace}=await import('/src/share-tools.js');return encodePlace(placeAddress(r.worldIdentity,r.S.wx,r.S.wy,'superficie'));}''')
   # Reload without lab so the screenshots exercise the normal World rendering.
   page.goto(base+'?testSeed=laboratorio&layout=wide&generation=2&addr='+address)
   page.wait_for_function('__testRuntime?.inWorld()');page.evaluate('''()=>{const r=__testRuntime;r.S.relaxedCreate=true;r.S.sound=false;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);}''')
   page.wait_for_function('__testRuntime.worldFamilyVisualStats?.examined>0')
   result=page.evaluate('''()=>{const r=__testRuntime,d=r.regionOfPos(r.S.wx,r.S.wy);r.S.ach.familyKept='2026-10-15';r.save();return {id:d.worldFamily.id,key:d.key,x:r.S.wx,y:r.S.wy,genre:d.genre,stats:r.worldFamilyVisualStats,overflow:document.documentElement.scrollWidth>innerWidth,lab:!!r.labMode,visible:r.livingNear(220).length};}''')
   assert 0<=result['stats']['clear']<=result['stats']['examined'];assert result['stats']['drawn']<=result['stats']['examined']
   assert result['id']==family and not result['lab'] and not result['overflow'] and result['visible']>0,result
   path=f'/tmp/whitedot-f1-{family}-phone.png';images.add(hashlib.sha256(page.screenshot(path=path)).hexdigest());rows.append(result)
   page.reload();page.wait_for_function('__testRuntime?.inWorld()')
   assert page.evaluate('__testRuntime.S.ach.familyKept')=='2026-10-15'
   assert page.evaluate('({x:__testRuntime.S.wx,y:__testRuntime.S.wy})')=={'x':result['x'],'y':result['y']}
   page.goto(base+'?testSeed=laboratorio&layout=wide&generation=2&lab=1');page.wait_for_function('__testRuntime?.labMode')
  assert len(images)==8 and len({r['key'] for r in rows})==8
  # Small phones, landscape phones, reduced motion, all three layers and low detail.
  for width,height in [(320,568),(844,390)]:
   page.set_viewport_size({'width':width,'height':height});page.emulate_media(reduced_motion='reduce')
   page.evaluate("__testRuntime.labGo('landscape:tidal')");page.wait_for_function('__testRuntime.worldFamilyVisualStats.examined>0')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  for layer in ['bajo','cielo']:
   page.evaluate('(layer)=>{const r=__testRuntime;r.S.layer=layer;r.drawWorldFamilyGround(performance.now());}',layer)
   page.wait_for_function('__testRuntime.worldFamilyVisualStats.drawn===0')
  assert not errors,errors
  (ROOT/'scripts/f1-world-family-browser-validation.json').write_text(json.dumps({'families':len(rows),'rows':rows,'pageErrors':errors},indent=2)+'\n')
  print('PASS eight real World destinations, visible distinct contours, inhabitants, exact WD1 return/progress, three phone sizes, reduced motion and scoped layers',flush=True)
  b.close()
finally:server.shutdown()
