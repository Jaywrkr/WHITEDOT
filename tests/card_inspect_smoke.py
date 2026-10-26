"""Choose a full rare card, read without countdown, keep other notices queued and return."""
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
  for w,h in [(320,568),(844,390),(1280,800)]:
   p=b.new_page(viewport={'width':w,'height':h});errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
   p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.collectRareCard')
   p.evaluate("()=>{const r=__r;r.S.sound=false;r.S.journey.finished=true;r.setJourneyMode('libre');document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);r.collectRareCard('fossil',{id:'inspect-test',x:r.S.wx,y:r.S.wy});}")
   p.wait_for_function('!document.getElementById("rareNotice").hidden');assert p.locator('#rareNoticeContinue').inner_text()=='Ver tarjeta'
   p.locator('#rareNoticeContinue').click();p.wait_for_function('document.getElementById("rareNotice").dataset.inspect==="true"')
   p.wait_for_timeout(100);remaining=p.evaluate('__r.rareNoticeState.remaining');pos=p.evaluate('[__r.S.wx,__r.S.wy]');p.keyboard.down('ArrowRight');p.wait_for_timeout(700);p.keyboard.up('ArrowRight')
   assert p.evaluate('__r.rareNoticeState.remaining')==remaining;assert p.evaluate('[__r.S.wx,__r.S.wy]')==pos
   assert p.locator('#rareNoticeAbility').evaluate('e=>getComputedStyle(e).whiteSpace')=='normal';assert p.locator('#rareNotice').get_attribute('role')=='dialog';assert 'Pulso' in p.inner_text('#rareNoticeAbility');assert '1/640' in p.inner_text('#rareNoticeOdds')
   p.evaluate("__r.toast('Mensaje pendiente',{level:2,force:true,coalesce:false})");p.wait_for_timeout(200);assert p.locator('#toast').is_hidden()
   p.locator('#rareNoticeOpen').click();p.wait_for_function('!document.getElementById("mJournal").hidden');assert 'Fósil' in p.inner_text('#journalBody');assert p.evaluate('__r.rareCards.length')>=1
   p.evaluate("""async()=>{const r=__r,m=await import('/src/rare-card-model.js'),base={sourceId:'shared-ui',world:r.worldIdentity,learning:{version:1,contexts:['one','two'],techniques:['normal','muted'],selected:'normal'}};window.__chosenIndex=r.S.rareBook.items.length+1;r.S.rareBook.items.push(m.makeRareCard({...structuredClone(base),type:'living:bridge'}),m.makeRareCard({...structuredClone(base),type:'living:study'}),m.makeRareCard({type:'fossil',sourceId:'incomplete-ui',world:r.worldIdentity,learning:{version:1}}));r.openJournal('rares');}""")
   assert p.locator('.rare-card').count()>=4,'incomplete learning never breaks the book'
   p.locator('.rare-card-details').evaluate_all('nodes=>nodes.forEach(e=>e.open=true)');p.locator('[data-rare-technique="'+str(p.evaluate('__chosenIndex'))+'"]').click()
   assert p.evaluate('__r.cardTechnique({id:"shared-ui"})')=='muted','the card selected in UI owns its shared source'
   p.evaluate("()=>{document.querySelectorAll('.modal').forEach(e=>e.hidden=true);__r.landHouse();}");p.wait_for_function('__r.houseActive()');assert p.locator('#houseObjects option').count()==40
   assert p.locator('#houseObjects optgroup').first.get_attribute('label')=='Puedes colocar'
   assert p.locator('#houseObjects optgroup[label="Puedes colocar"] option:disabled').count()==0
   assert not errors,errors;p.close()
  b.close()
 print('PASS rare inspection: explicit full card, paused countdown/movement, queued notices, book identity and owned-first house palette at three sizes',flush=True)
finally:srv.shutdown();srv.server_close()
