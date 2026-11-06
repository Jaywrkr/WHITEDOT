"""TEMPORARY diagnostic (remove before merge): menu layout and fonts at 844x390, container vs runner."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,json,subprocess
ROOT=Path(__file__).resolve().parents[1]
for c in (['fc-match','monospace:charset=2605'],['fc-match','sans-serif'],['fc-match','monospace'],['fc-match','system-ui'],['sh','-c','fc-list | wc -l'],['sh','-c','fc-list : family | sort -u']):
 try:print('$',' '.join(c),'\n',subprocess.run(c,capture_output=True,text=True).stdout.strip(),flush=True)
 except Exception as e:print(c,e)
print('which chromium',shutil.which('chromium'),shutil.which('chromium-browser'),'CHROMIUM_PATH',os.environ.get('CHROMIUM_PATH'),flush=True)
class H(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start()
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(e=>e.hidden=true)"
with sync_playwright() as pw:
 exe=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('chromium-browser') or pw.chromium.executable_path
 b=pw.chromium.launch(executable_path=exe,args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
 print('exe',exe,'version',b.version,flush=True)
 p=b.new_page(viewport={'width':844,'height':390})
 p.route('**/src/main.js',lambda route:route.fulfill(body=(ROOT/'src/main.js').read_text()+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(f'http://127.0.0.1:{srv.server_port}/?anillo=1');p.wait_for_function('!!window.__r?.openLugares&&!!window.__r?.tidyMenu');p.wait_for_timeout(2500);p.evaluate(HIDE)
 if p.evaluate('__r.journeyMode()')!='libre':p.evaluate("__r.setJourneyMode('libre')")
 p.evaluate(HIDE);p.wait_for_timeout(200)
 p.locator('#bMenu').click();p.wait_for_timeout(300)
 print('ua',p.evaluate('navigator.userAgent'),'dpr',p.evaluate('devicePixelRatio'),'fonts',p.evaluate("[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight).join(',')"),flush=True)
 rows=p.evaluate("""(()=>{const dev=document.body.classList.contains('dev');document.body.classList.remove('dev');const s=document.querySelector('#mMenu .menu-sheet');const out=[[ 'sheet',s.scrollHeight,s.clientHeight,s.getBoundingClientRect().top,s.getBoundingClientRect().bottom]];
 for(const e of s.querySelectorAll('*')){const r=e.getBoundingClientRect();if(!r.height)continue;const cs=getComputedStyle(e);out.push([e.tagName+(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.replace(/ /g,'.'):''),Math.round(r.top*10)/10,Math.round(r.height*10)/10,Math.round(r.width*10)/10,cs.fontSize,cs.lineHeight,(e.childNodes.length&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))?e.textContent.trim().slice(0,40):''])}
 document.body.classList.toggle('dev',dev);return out})()""")
 for r in rows:print('ROW',json.dumps(r,ensure_ascii=False),flush=True)
 cdp=p.context.new_cdp_session(p);cdp.send('DOM.enable');cdp.send('CSS.enable')
 doc=cdp.send('DOM.getDocument',{'depth':-1})
 ids=cdp.send('DOM.querySelectorAll',{'nodeId':doc['root']['nodeId'],'selector':'#mMenu .menu-sheet *'})['nodeIds']
 seen={}
 for n in ids:
  try:f=cdp.send('CSS.getPlatformFontsForNode',{'nodeId':n})['fonts']
  except Exception:continue
  for x in f:seen[x['familyName']+('/'+x.get('postScriptName','') )]=seen.get(x['familyName']+('/'+x.get('postScriptName','')),0)+x['glyphCount']
 print('PLATFORM FONTS',json.dumps(seen,ensure_ascii=False),flush=True)
 b.close()
