"""Evidence for the fourth panel. UI states are scripted fixtures, not human play."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json,subprocess
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('OUT','/tmp/kubono-panel-4'));OUT.mkdir(parents=True,exist_ok=True)
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)))
threading.Thread(target=srv.serve_forever,daemon=True).start()
SCAN="""()=>{const visible=e=>{if(e.closest('[hidden]'))return false;for(let p=e.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open&&!p.querySelector(':scope > summary')?.contains(e))return false;const r=e.getBoundingClientRect(),s=getComputedStyle(e);if(!r.width||!r.height||r.bottom<=0||r.right<=0||r.top>=innerHeight||r.left>=innerWidth||s.visibility==='hidden'||s.display==='none'||Number(s.opacity)===0)return false;
 for(let p=e.parentElement;p;p=p.parentElement){const q=getComputedStyle(p);if(q.overflowY!=='visible'||q.overflowX!=='visible'){const b=p.getBoundingClientRect();if(r.bottom<=b.top||r.top>=b.bottom||r.right<=b.left||r.left>=b.right)return false;}}return true;};
 const label=e=>(e.innerText||e.getAttribute('aria-label')||e.id||e.tagName).trim().replace(/\\s+/g,' ').slice(0,110);
 const els=[...document.body.querySelectorAll('*')].filter(visible);
 const buttons=els.filter(e=>e.matches('button,select,input:not([type=hidden]),a[href]'));
 const target=e=>e.matches('input[type=checkbox]')&&e.labels?.length?e.labels[0]:e;const tiny=buttons.filter(e=>{const b=target(e).getBoundingClientRect();return b.width<24||b.height<24;}).map(e=>{const b=target(e).getBoundingClientRect();return {id:e.id,label:label(e),width:+b.width.toFixed(1),height:+b.height.toFixed(1)};});
 const text=els.filter(e=>!e.children.length&&e.textContent.trim());
 return {mode:__r.S.mode,journeyMode:__r.journeyMode(),dev:document.body.classList.contains('dev'),headings:els.filter(e=>e.matches('h1,h2,h3')).map(label),
 visibleButtons:buttons.map(label),technicalText:text.filter(e=>/prototipo|demo|prueba|laboratorio|alpha|deploy/i.test(e.textContent)).map(e=>({id:e.id,text:label(e)})),
 smallText:text.filter(e=>parseFloat(getComputedStyle(e).fontSize)<11).map(e=>({id:e.id,text:label(e),font:getComputedStyle(e).fontSize})).slice(0,12),smallTargets:tiny,
 overflow:els.filter(e=>e.matches('.modal,.sheet,#journalBody')&&e.scrollWidth>e.clientWidth+2).map(e=>({id:e.id,class:e.className,client:e.clientWidth,scroll:e.scrollWidth})),
 openDialogs:els.filter(e=>e.matches('.modal,[role=dialog]')).map(e=>e.id),pageWidth:innerWidth,documentWidth:document.documentElement.scrollWidth};
}"""
CASES=[
 ('mundo-libre',''),
 ('menu',"r.$('bMenu').click()"),
 ('menu-mas',"r.$('bMenu').click();r.$('menuMore').open=true"),
 ('cubo-llevar',"r.openCube('wear')"),('cubo-tienda',"r.openCube('shop')"),('cubo-viaje',"r.openCube('travel')"),
 ('sonido',"r.$('bMusicSettings').click()"),('ajustes',"r.$('bSettings').click()"),('guia',"r.$('bGuide').click()"),
 ('bitacora-hoy',"r.openJournal('today')"),('bitacora-coleccion',"r.openJournal('collection')"),
 ('bitacora-musica',"r.openJournal('music')"),('bitacora-logros',"r.openJournal('achievements')"),
 ('bitacora-tu',"r.openJournal('you')"),('lugares',"r.openLugares()")]
rows=[]
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--no-proxy-server','--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
  for width,height in [(320,568),(390,844),(844,390),(1280,800)]:
   page=b.new_page(viewport={'width':width,'height':height},has_touch=True)
   page.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>false})")
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
   page.goto(f'http://kubono.localhost:{srv.server_port}/?anillo=1');page.wait_for_function('!!window.__r?.openCube&&__r.inWorld()')
   page.evaluate("()=>{__r.S.sound=false;__r.setJourneyMode('libre');document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);}")
   for name,action in CASES:
    page.evaluate("()=>{document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true);}")
    page.evaluate('()=>{const r=__r;'+action+'}')
    page.wait_for_timeout(150)
    result=page.evaluate(SCAN);result.update(surface=name,viewport=[width,height])
    assert not result['dev'];assert not errors,errors
    rows.append(result)
    if width==390:page.screenshot(path=str(OUT/f'ui-{name}.png'))
   page.close()
  b.close()
finally:srv.shutdown();srv.server_close()
(OUT/'ui-medidas.json').write_text(json.dumps({'revision':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'scope':'Local scripted production-appearance fixtures, normal hostname and webdriver=false; no human testing','states':rows},ensure_ascii=False,indent=2)+'\n')
print('PASS',len(rows),'UI states, no page errors; observations in',OUT,flush=True)
