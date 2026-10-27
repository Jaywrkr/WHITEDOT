"""Shared steps for the English walks (L2): a phone at 390×844 on a normal browser whose system language is English.
Each check reads the visible page text, its labels and every text drawn on the canvas, and fails on Spanish (accents,
ñ, ¿, ¡ or Spanish-only words such as «el», «la», «de», «Tu») and on any visible text cut by its box or the screen.
Screens follow scripts/panel-capture.py; menus follow docs/panel/sesion-11/evidencia/capturas-menus.py. Screenshots go
to $KUBONO_EN_CAPTURES (a temporary folder when unset)."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import threading,os,shutil,tempfile
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(os.environ.get('KUBONO_EN_CAPTURES') or tempfile.mkdtemp(prefix='kubono-en-'));OUT.mkdir(parents=True,exist_ok=True)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
def serve():
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
 return server
def launch(pw):
 return pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required','--no-proxy-server','--host-resolver-rules=MAP kubono.localhost 127.0.0.1'])
# A player's phone: no automation mark, English system language, canvas text recorded as it is drawn.
INIT='''Object.defineProperty(navigator,'webdriver',{get:()=>false});Object.defineProperty(navigator,'languages',{get:()=>['en-US','en']});Object.defineProperty(navigator,'language',{get:()=>'en-US'});
window.__drawn=new Set();for(const P of [CanvasRenderingContext2D.prototype]){const f=P.fillText;P.fillText=function(t,...r){try{if(typeof t==='string'&&t.trim())window.__drawn.add(t)}catch(_){}return f.call(this,t,...r)};}'''
def new_page(browser,width=390,height=844):
 page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script(INIT)
 page.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 return page,errors
def open_game(page,port,query=''):
 page.goto(f'http://kubono.localhost:{port}/{query}');page.wait_for_function('!!window.__r',timeout=30000);page.wait_for_timeout(1800)
 assert page.evaluate('__r.lang')=='en' and page.evaluate('document.documentElement.lang')=='en','the English system starts the game in English'
 page.evaluate("()=>{__r.S.sound=true;__r.audio();}");page.wait_for_timeout(900)
# Panel captures (scripts/panel-capture.py): the same forced panels.
EXTRA={'lugares':'r.openLugares()','song':'r.openSong()','wild':'r.wildSpawn()','menu':"r.$('bMenu').click()",'guide':"r.$('bGuide').click()",
 'cards':"for(let i=0;i<3;i++)r.collectRareCard('fossil',{id:'capture:fixture:'+i,x:r.S.wx+i,y:r.S.wy},{forced:true});r.openJournal('rares');document.querySelector('[data-garden-add]')?.click();",
 'favorites':"r.addFavorite('Mi primer lugar');r.openFavorites();",
 'result':"for(let i=0;i<500;i++)r.placeHear('lago',i<373,{});const real=Date.now,now=real();r.S.lugares.run.startedAt=now-59999;Date.now=()=>now;try{r.placeFinish('lago');}finally{Date.now=real;}"}
def panel(page,extra):
 page.evaluate("k=>{const r=__r;document.querySelectorAll('.modal').forEach(m=>m.hidden=true);"+EXTRA[extra]+"}")
 if extra=='result':page.wait_for_function("!document.getElementById('mPlace').hidden",timeout=15000)
 page.wait_for_timeout(1200)
SPANISH_JS=r'''()=>{
 const WORDS=new Set('el la las los de del y en con por para una unos unas un tu tus su sus que qué más al se es lo sin muy ya hay cada este esta otro otra todo nada aquí ahora también pero porque está están'.split(' '));
 const spanish=t=>/[áéíóúñÁÉÍÓÚÑ¿¡]/.test(t)||(t.toLowerCase().match(/\p{L}+(?:[-'’]\p{L}+)*/gu)||[]).some(w=>WORDS.has(w));
 const shown=el=>{if(!el||el.closest('[translate="no"],script,style,noscript'))return false;if(!el.getClientRects().length)return false;const cs=getComputedStyle(el);return cs.visibility!=='hidden';};
 const found=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while((n=w.nextNode()))if(n.data.trim()&&shown(n.parentElement)&&spanish(n.data))found.push(n.data.trim());
 for(const el of document.querySelectorAll('[aria-label],[title],[placeholder],[alt]'))if(shown(el))for(const a of ['aria-label','title','placeholder','alt']){const v=el.getAttribute(a);if(v&&spanish(v))found.push(a+': '+v);}
 for(const t of window.__drawn||[])if(spanish(t))found.push('canvas: '+t);
 if(spanish(document.title))found.push('title: '+document.title);
 return [...new Set(found)];}'''
# Text cut by its own box (wider than it, or ellipsis) or by the screen's edge. Horizontal scrollers and screen-reader
# text are left aside: they are meant to run past the edge.
OVERFLOW_JS=r'''()=>{
 const W=innerWidth,out=[];
 for(const el of document.querySelectorAll('body *')){
  if(el.closest('[translate="no"],svg,canvas,script,style,.sr-only,[hidden]'))continue;
  if(![...el.childNodes].some(n=>n.nodeType===3&&n.data.trim()))continue;
  const r=el.getBoundingClientRect();if(r.width<2||r.height<2)continue;
  const cs=getComputedStyle(el);if(cs.visibility==='hidden'||+cs.opacity===0||cs.display==='inline')continue;
  let scroller=false;for(let p=el.parentElement;p;p=p.parentElement){const o=getComputedStyle(p).overflowX;if(o==='auto'||o==='scroll'){scroller=true;break;}}
  const label=(el.id?'#'+el.id:el.tagName.toLowerCase()+(el.className&&typeof el.className==='string'?'.'+el.className.split(' ')[0]:''))+' «'+el.textContent.trim().slice(0,60)+'»';
  if(el.scrollWidth>el.clientWidth+1&&el.clientWidth>0&&cs.overflowX!=='auto'&&cs.overflowX!=='scroll')out.push('cut: '+label);
  else if(!scroller&&(r.right>W+1||r.left<-1))out.push('off screen: '+label);
 }
 return out;}'''
def check(page,name):
 page.evaluate('document.fonts.ready');page.wait_for_timeout(300)
 page.screenshot(path=str(OUT/f'{name}.png'))
 spanish=page.evaluate(SPANISH_JS);assert not spanish,(name,'Spanish text in English:',spanish)
 cut=page.evaluate(OVERFLOW_JS);assert not cut,(name,'text cut at '+str(page.viewport_size),cut)
 page.evaluate('window.__drawn=new Set()')
