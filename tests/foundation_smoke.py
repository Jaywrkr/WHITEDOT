from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for width,height in [(390,844),(844,390),(1280,800)]:
   context=browser.new_context(viewport={'width':width,'height':height},accept_downloads=True,has_touch=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.set_default_timeout(10000)
   page.add_init_script("const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(window.__quota&&k.startsWith('pixel-blanco'))throw new DOMException('Quota','QuotaExceededError');return original.call(this,k,v)}")
   page.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text().replace('await requireAccount()', 'null')+'\nwindow.__testRuntime=runtime;',content_type='text/javascript'))
   page.goto(f'http://127.0.0.1:{server.server_port}/?testSeed=foundation-lab&layout=classic');page.wait_for_function('window.__testRuntime?.S.mode==="world"');page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)")
   page.evaluate("__testRuntime.S.ach.fixture='2026-10-13';__testRuntime.S.studio.slots={'0,0':'luz'};__testRuntime.addFavorite('Mi música');__testRuntime.save()")
   assert page.evaluate('__testRuntime.favorites[0].address.seed')=='foundation-lab'
   def open_tools():
    page.locator('#bMenu').click();page.evaluate('(window.__r||window.__testRuntime).openSaveTools()');assert page.locator('#mSaveTools').is_visible()
   open_tools()
   with page.expect_download() as event:page.locator('#saveExport').click()
   raw=Path(event.value.path()).read_bytes();backup=json.loads(raw);assert backup['state']['ach']['fixture']=='2026-10-13';assert backup['worldIdentity']['layout']=='classic'
   # Unsupported favorites retain their address across reloads and never start autopilot.
   page.evaluate('__testRuntime.favorites[0].address.generatorVersion=2;__testRuntime.save();location.reload()')
   page.wait_for_function('window.__testRuntime?.favorites?.length===1');assert page.evaluate('__testRuntime.favorites[0].address.generatorVersion')==2
   assert page.evaluate('__testRuntime.selectDestination(__testRuntime.favorites[0].id)') is False
   assert page.evaluate('__testRuntime.S.destination') is None
   page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");open_tools()
   # Quota failure keeps the disk save and the current in-memory progress accessible.
   persisted=page.evaluate('localStorage.getItem(__testRuntime.saveStore.key)');page.evaluate('window.__quota=true;__testRuntime.S.totalLight+=20;__testRuntime.save()');assert page.evaluate('__testRuntime.storageStatus.kind')=='write-error';assert page.evaluate('localStorage.getItem(__testRuntime.saveStore.key)')==persisted
   page.locator('#saveToolsClose').click();open_tools();assert 'No se pudo guardar' in page.locator('#saveStatus').inner_text();page.evaluate('window.__quota=false')
   with page.expect_download():page.locator('#saveExport').click()
   foreign={**backup,'scope':{**backup['scope'],'seed':'other'}}
   page.locator('#saveImportFile').set_input_files({'name':'other.json','mimeType':'application/json','buffer':json.dumps(foreign).encode()});page.wait_for_function('document.getElementById("saveStatus").textContent.includes("otra partida")');assert page.locator('#saveImportApply').is_disabled()
   page.locator('#saveImportFile').set_input_files({'name':'valid.json','mimeType':'application/json','buffer':raw});page.wait_for_function('!document.getElementById("saveImportApply").disabled');page.locator('#saveImportApply').click()
   page.wait_for_function('window.__testRuntime?.S.ach.fixture');assert page.evaluate('__testRuntime.S.studio.slots["0,0"]')=='luz';assert page.evaluate('!!localStorage.getItem(__testRuntime.saveStore.key+":before-restore")')
   # A future generator must remain untouched by autosave, even though a safe session opens.
   page.evaluate("const r=__testRuntime,s=JSON.parse(localStorage.getItem(r.saveStore.key));s.worldIdentity.generatorVersion=2;localStorage.setItem(r.saveStore.key,JSON.stringify(s));location.reload()")
   page.wait_for_function('window.__testRuntime?.storageStatus.kind==="unsupported"');page.evaluate('__testRuntime.save()');assert page.evaluate('JSON.parse(localStorage.getItem(__testRuntime.saveStore.key)).worldIdentity.generatorVersion')==2
   # Corruption can recover only through an explicit action, with original retained.
   page.evaluate("const r=__testRuntime;localStorage.setItem(r.saveStore.key+':backup',localStorage.getItem(r.saveStore.key+':before-restore'));localStorage.setItem(r.saveStore.key,'{broken');location.reload()")
   page.wait_for_function('window.__testRuntime?.storageStatus.kind==="recovered"');page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");open_tools();page.locator('#saveRecover').click();page.wait_for_function('window.__testRuntime?.storageStatus.kind==="ok"');assert page.evaluate('localStorage.getItem(__testRuntime.saveStore.key+":before-restore")')=='{broken'
   page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");open_tools();page.screenshot(path=f'/tmp/whitedot-foundation-backup-{width}.png')
   assert not errors,errors;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');print(f'PASS {width}x{height}: identity, backup download, quota notification, foreign-scope rejection, explicit import/recovery and preserved corrupt/future originals',flush=True);context.close()
  browser.close()
finally:server.shutdown()
