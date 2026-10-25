"""Durable favorite edits and real dynamic finale focus/close contracts."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,shutil,threading
ROOT=Path(__file__).resolve().parents[1]
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  for W,H in [(390,844),(1280,800)]:
   p=b.new_page(viewport={'width':W,'height':H});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.addFavorite&&__r.inWorld()')
   p.evaluate("()=>{__r.S.sound=false;__r.setJourneyMode('libre');document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);__r.addFavorite('Guardado');}")
   p.evaluate("()=>{window.__set=Storage.prototype.setItem;window.__deny=true;Storage.prototype.setItem=function(k,v){if(__deny&&k===__r.saveStore.key)throw new DOMException('Full','QuotaExceededError');return __set.call(this,k,v);};}")
   result=p.evaluate("()=>{const r=__r,f=r.favorites[0];r.selectDestination(f.id);const name=f.name,notes=f.notes,items=r.S.favorites.items;const renamed=r.renameFavorite(f.id,'Otro'),noted=r.updateFavoriteNotes(f.id,'Cambio'),removed=r.removeFavorite(f.id);return {renamed,noted,removed,name:f.name,notes:f.notes,sameItems:r.S.favorites.items===items,count:r.favorites.length,destination:r.S.destination===f.id};}")
   assert result=={'renamed':None,'noted':False,'removed':False,'name':'Guardado','notes':'','sameItems':True,'count':1,'destination':True},result
   p.evaluate("()=>{__deny=false;__r.renameFavorite(__r.favorites[0].id,'Conservado');__r.updateFavoriteNotes(__r.favorites[0].id,'Mi frase');__r.save();}")
   assert p.evaluate('__r.favorites[0].name')=='Conservado' and p.evaluate('__r.favorites[0].notes')=='Mi frase'
   # Both dynamic overlays trap focus and call their true close action on Escape.
   p.evaluate("()=>{document.querySelectorAll('.modal').forEach(e=>e.hidden=true);__r.openSong();}")
   p.wait_for_function('document.getElementById("songStage").contains(document.activeElement)')
   assert p.locator('#songStage').get_attribute('aria-modal')=='true' and p.locator('#w').evaluate('e=>e.inert')
   at=p.evaluate('[__r.S.wx,__r.S.wy]');p.keyboard.down('ArrowRight');p.wait_for_timeout(400);p.keyboard.up('ArrowRight');assert p.evaluate('[__r.S.wx,__r.S.wy]')==at
   for i in range(5):p.keyboard.press('Tab');assert p.evaluate('document.getElementById("songStage").contains(document.activeElement)')
   p.keyboard.press('Escape');p.wait_for_function('!__r.songStageState().running&&document.getElementById("songStage").hidden')
   p.wait_for_function('!document.getElementById("w").inert')
   p.evaluate("()=>{const j=__r.S.journey;j.finished=false;j.mode='viaje';j.notes={llanura:[57]};__r.journeyFinale();}")
   p.wait_for_function('document.activeElement.id==="journeyFinale"');p.keyboard.press('Tab');assert p.evaluate('document.activeElement.id')=='journeyFinale'
   assert p.locator('#journeyFinale').get_attribute('aria-modal')=='true'
   p.keyboard.press('Escape');p.wait_for_function('!__r.journeyFinaleState().running&&__r.inWorld()&&!document.getElementById("w").inert')
   assert p.evaluate('document.activeElement.id')=='w'
   assert not errors,errors;p.close()
  b.close()
 print('PASS edit rollback, durable retry, dynamic song/finale focus isolation, Tab, blocked movement and real Escape closure on phone/desktop',flush=True)
finally:srv.shutdown();srv.server_close()
