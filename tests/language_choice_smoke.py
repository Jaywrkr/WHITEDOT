"""L2 · choosing the language. A phone in English starts a new game in English (<html lang="en">, the save says 'en'); a
phone in Spanish starts in Spanish. Ajustes changes it live both ways and Spanish comes back exactly as it was; the
choice survives a reload. A game saved before L2 (no language in the save) stays in Spanish on an English phone."""
from playwright.sync_api import sync_playwright
import json
from english_helpers import serve,launch,ROOT
SYSTEM='''(()=>{let v;try{v=localStorage.getItem('test:system')}catch(_){};v=v||'en-US';Object.defineProperty(navigator,'languages',{get:()=>[v]});Object.defineProperty(navigator,'language',{get:()=>v});Object.defineProperty(navigator,'webdriver',{get:()=>false});})()'''
READY='!!window.__r&&!!__r.S'
def context(browser):
 c=browser.new_context(viewport={'width':390,'height':844});c.add_init_script(SYSTEM)
 c.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));return c,page,errors
def state(page):
 return page.evaluate("({lang:__r.lang,html:document.documentElement.lang,saved:__r.S.lang,settings:document.querySelector('#bSettings span').firstChild.data,guide:document.querySelector('#bGuide span').textContent,select:document.getElementById('language').value})")
def choose(page,value):
 page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.locator('#bMenu').click();page.locator('#bSettings').click()
 page.locator('#language').select_option(value);page.wait_for_function(f"__r.lang==='{value}'&&document.documentElement.lang==='{value}'");page.wait_for_timeout(300)
STATIC="[...document.querySelectorAll('#mMenu,#mSettings,#mGuide,#mCube,.hud,#dock')].map(e=>e.innerHTML).join('\\n')"
server=serve();port=server.server_port
try:
 with sync_playwright() as pw:
  browser=launch(pw)
  # 1. A Spanish phone: Spanish; English in Ajustes; back to Spanish exactly as it was.
  c,page,errors=context(browser);page.goto(f'http://127.0.0.1:{port}/manifest.webmanifest');page.evaluate("localStorage.setItem('test:system','es-ES')");page.goto(f'http://127.0.0.1:{port}/');page.wait_for_function(READY);page.wait_for_timeout(1200)
  assert state(page)=={'lang':'es','html':'es','saved':'es','settings':'Ajustes','guide':'Cómo jugar','select':'es'},state(page)
  choose(page,'es');page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.wait_for_timeout(300);spanish=page.evaluate(STATIC)
  choose(page,'en');assert state(page)=={'lang':'en','html':'en','saved':'en','settings':'Settings','guide':'How to play','select':'en'},state(page)
  # Straight back: the page is the Spanish one, to the byte.
  choose(page,'es');page.evaluate("document.querySelectorAll('.modal').forEach(m=>m.hidden=true)");page.wait_for_timeout(300)
  back=page.evaluate(STATIC)
  if back!=spanish:
   import difflib;print('\n'.join(list(difflib.unified_diff(spanish.split('><'),back.split('><'),lineterm=''))[:60]))
  assert back==spanish,'Spanish comes back exactly'
  choose(page,'en')
  assert page.evaluate("__r.save()")!=False and json.loads(page.evaluate("localStorage.getItem('pixel-blanco-v4')"))['lang']=='en'
  page.reload();page.wait_for_function(READY);page.wait_for_timeout(800);assert state(page)['lang']=='en' and state(page)['settings']=='Settings','the choice survives a reload'
  choose(page,'es');assert state(page)=={'lang':'es','html':'es','saved':'es','settings':'Ajustes','guide':'Cómo jugar','select':'es'},state(page)
  # Labels built from a heading while the page was in English come back in Spanish too.
  assert page.evaluate("document.querySelector('#mGuide .sheet-close').getAttribute('aria-label')")=='Cerrar Guía de juego'
  assert not errors,errors;c.close()
  # 2. An English phone and a new game: English from the first frame, in the save too.
  c,page,errors=context(browser);page.goto(f'http://127.0.0.1:{port}/');page.wait_for_function(READY);page.wait_for_timeout(1200)
  assert state(page)=={'lang':'en','html':'en','saved':'en','settings':'Settings','guide':'How to play','select':'en'},state(page)
  assert page.evaluate("localStorage.getItem('kubono:lang')")=='en'
  assert not errors,errors;c.close()
  # 3. A game saved before L2 (no language) on an English phone stays in Spanish, and the save says so from now on.
  c,page,errors=context(browser);page.goto(f'http://127.0.0.1:{port}/manifest.webmanifest');page.evaluate("localStorage.setItem('test:system','es-ES')");page.goto(f'http://127.0.0.1:{port}/');page.wait_for_function(READY)
  page.evaluate("()=>{__r.S.sparks=33;if(!__r.save())throw Error('save');const s=JSON.parse(localStorage.getItem('pixel-blanco-v4'));delete s.lang;localStorage.setItem('pixel-blanco-v4',JSON.stringify(s));localStorage.removeItem('kubono:lang');localStorage.setItem('test:system','en-US');}")
  page.reload();page.wait_for_function(READY);page.wait_for_timeout(1000)
  assert page.evaluate("navigator.languages[0]")=='en-US'
  assert state(page)=={'lang':'es','html':'es','saved':'es','settings':'Ajustes','guide':'Cómo jugar','select':'es'},state(page)
  assert page.evaluate('__r.S.sparks')==33,'progress kept'
  assert not errors,errors;c.close()
  browser.close()
finally:server.shutdown();server.server_close()
print('PASS language choice: system language for a new game, Spanish for older saves, Ajustes both ways with Spanish restored exactly, kept after reload')
