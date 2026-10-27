"""L4 · Desktop build (Electron) for itch.io. Packages the Linux build with scripts/desktop-package.mjs (or takes
KUBONO_DESKTOP_BUILD, an unpacked Kubono-linux-x64 folder), opens it without a screen (Xvfb) and drives it over the
DevTools protocol: a 1280x800 window titled Kubono, the sale edition from app://kubono, a real F11 key press (XTest) taken by
the wrapper, sound after the first click, a save, a clean exit when the window closes, the save kept on reopening, the save
in the user profile under the app ID, and nothing leaving the computer: one deliberate fetch is blocked, and a recording
proxy given to the whole app (--proxy-server) sees no connection at all, from the page or from Electron itself.
Needs desktop/node_modules ((cd desktop && npm ci)) unless KUBONO_DESKTOP_BUILD is given, and Xvfb (the window manager's
fullscreen resize is not checked: Xvfb has none)."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import ctypes,os,shutil,signal,socket,socketserver,subprocess,tempfile,threading,time,urllib.request
ROOT=Path(__file__).resolve().parents[1]
started=time.time()
work=Path(tempfile.mkdtemp(prefix='kubono-desktop-test-'))
APP_ID='com.playkubono.kubono'
procs=[];servers=[]
def free_port():
 with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
# Every connection Electron opens goes through this proxy, which only writes down what was asked and closes.
proxied=[]
class Recorder(socketserver.BaseRequestHandler):
 def handle(self):
  try:proxied.append(self.request.recv(1024).split(b'\r\n')[0].decode('latin-1'))
  except Exception as e:proxied.append('?'+str(e))
proxy=socketserver.ThreadingTCPServer(('127.0.0.1',0),Recorder);proxy.daemon_threads=True;servers.append(proxy)
threading.Thread(target=proxy.serve_forever,daemon=True).start()
try:
 # 1. The Linux build, copied so the test can instrument it (runtime is never exposed in a build).
 given=os.environ.get('KUBONO_DESKTOP_BUILD')
 if given:build=Path(given)
 else:
  if not (ROOT/'desktop/node_modules/@electron/packager').exists():raise SystemExit('FAIL desktop: run (cd desktop && npm ci) first, or set KUBONO_DESKTOP_BUILD')
  subprocess.run(['node',str(ROOT/'scripts/desktop-package.mjs'),'--platform','linux','--no-archive','--out',str(work/'dist')],check=True,capture_output=True,text=True)
  build=work/'dist'/'Kubono-linux-x64'
 app=work/'Kubono';shutil.copytree(build,app,symlinks=True)
 game=app/'resources/app/game'
 assert "EDITION='store'" in (game/'src/edition.js').read_text(encoding='utf-8'),'sale edition'
 assert '<meta name="kubono-service-worker" content="off">' in (game/'index.html').read_text(encoding='utf-8')
 assert not (game/'sw.js').exists() and not (app/'resources/app/node_modules').exists()
 main=game/'src/main.js';main.write_text(main.read_text(encoding='utf-8')+'\nwindow.__r=runtime;',encoding='utf-8')
 home=work/'home';(home/'.config').mkdir(parents=True)
 # A private X screen (Xvfb) bigger than the window, and XTest to press real keys on it.
 if not shutil.which('Xvfb'):raise SystemExit('FAIL desktop: Xvfb is needed')
 display=next(f':{n}' for n in range(90,140) if not Path(f'/tmp/.X11-unix/X{n}').exists() and not Path(f'/tmp/.X{n}-lock').exists())
 xvfb=subprocess.Popen(['Xvfb',display,'-screen','0','1600x1000x24','-nolisten','tcp'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True);procs.append(xvfb)
 for _ in range(100):
  if Path(f'/tmp/.X11-unix/X{display[1:]}').exists():break
  time.sleep(0.05)
 X=ctypes.cdll.LoadLibrary('libX11.so.6');XT=ctypes.cdll.LoadLibrary('libXtst.so.6');X.XOpenDisplay.restype=ctypes.c_void_p
 xd=ctypes.c_void_p(X.XOpenDisplay(display.encode()));assert xd.value,'no X display'
 def press(keysym):
  code=X.XKeysymToKeycode(xd,ctypes.c_ulong(keysym));XT.XTestFakeMotionEvent(xd,-1,640,400,0)
  XT.XTestFakeKeyEvent(xd,code,1,0);XT.XTestFakeKeyEvent(xd,code,0,0);X.XFlush(xd)
 env={k:v for k,v in os.environ.items() if not k.lower().endswith('_proxy')}
 env.update({'DISPLAY':display,'HOME':str(home),'XDG_CONFIG_HOME':str(home/'.config'),'LANG':'es_ES.UTF-8','LANGUAGE':'es'})
 def launch():
  port=free_port();log=open(work/f'electron-{port}.log','w')
  cmd=[str(app/'kubono'),f'--remote-debugging-port={port}',f'--proxy-server=127.0.0.1:{proxy.server_address[1]}',*(['--no-sandbox'] if os.geteuid()==0 else [])]
  proc=subprocess.Popen(cmd,env=env,stdout=log,stderr=subprocess.STDOUT,start_new_session=True);procs.append(proc)
  for _ in range(300):
   try:urllib.request.urlopen(f'http://127.0.0.1:{port}/json/version',timeout=1);break
   except Exception:
    if proc.poll() is not None:raise AssertionError('Kubono exited at start: '+(work/f'electron-{port}.log').read_text())
    time.sleep(0.1)
  return proc,port,work/f'electron-{port}.log'
 ready='!!window.__r?.journeyMode&&!!window.__r?.save&&document.querySelector("canvas").width>300'
 def find_page(browser):
  for _ in range(200):
   pages=[p for c in browser.contexts for p in c.pages if p.url.startswith('app://kubono/')]
   if pages:return pages[0]
   time.sleep(0.05)
  raise AssertionError('the game window did not open')
 def wait_exit(proc,label):
  try:code=proc.wait(timeout=20)
  except subprocess.TimeoutExpired:raise AssertionError(label+': Kubono did not quit when its window closed')
  assert code==0,(label,code)
 with sync_playwright() as pw:
  # 2. First run: window, sale edition, fullscreen, sound, save, no network; closing the window quits the app.
  proc,port,log=launch()
  browser=pw.chromium.connect_over_cdp(f'http://127.0.0.1:{port}')
  page=find_page(browser);errors=[];outside=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.on('request',lambda r:None if r.url.startswith(('app://kubono/','data:','blob:')) else outside.append(r.url))
  page.wait_for_function(ready,timeout=30000)
  state=page.evaluate("({edition:__r.edition,origin:location.origin,title:document.title,w:innerWidth,h:innerHeight,sw:!!navigator.serviceWorker?.controller,ac:!!window.__r.ac&&window.__r.ac.state==='running'})")
  assert state['edition']=='store' and state['origin']=='app://kubono' and state['title']=='Kubono',state
  assert (state['w'],state['h'])==(1280,800),state
  assert not state['sw'] and not state['ac'],'no worker, no sound before the first click: '+str(state)
  # A real F11 is the wrapper's (fullscreen), not the game's; other keys still reach the game.
  page.evaluate("window.__keys=[];addEventListener('keydown',e=>__keys.push(e.key),true)")
  press(0xFFC8);press(0x61);page.wait_for_function("__keys.includes('a')",timeout=5000);press(0xFFC8);page.wait_for_timeout(300)
  keys=page.evaluate('__keys');assert keys==['a'],keys
  page.mouse.click(640,480)
  page.wait_for_function("window.__r.ac?.state==='running'",timeout=10000)
  page.evaluate("()=>{const s=__r.S;s.sparks=57;s.pathCrystals=Array.from({length:10},(_,i)=>'desk:'+i);if(!__r.save())throw Error('save failed');}")
  size=page.evaluate("localStorage.getItem('pixel-blanco-v4').length")
  # The wrapper blocks the network: a deliberate request fails and is logged; the game itself asks for nothing outside.
  denied=page.evaluate("fetch('https://example.com/kubono-probe').then(()=>'reached',()=>'blocked')")
  assert denied=='blocked',denied
  page.wait_for_timeout(500)
  assert outside==['https://example.com/kubono-probe'],outside
  assert not errors or all('kubono-probe' in e or 'ERR_BLOCKED_BY_CLIENT' in e for e in errors),errors
  errors.clear()
  page.evaluate('window.close()')
  wait_exit(proc,'first run')
  blocked=[l for l in log.read_text(errors='replace').splitlines() if l.startswith('[kubono] blocked')]
  assert blocked==['[kubono] blocked https://example.com/kubono-probe'],blocked
  assert not proxied,'connections from the first run: '+str(proxied)
  profile=home/'.config'/APP_ID
  assert (profile/'Local Storage').is_dir(),'the save lives in the user profile under the app ID: '+str(list((home/'.config').iterdir()))
  # 3. Second run: the game is still there.
  proc,port,log=launch()
  browser=pw.chromium.connect_over_cdp(f'http://127.0.0.1:{port}')
  page=find_page(browser);outside=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
  page.on('request',lambda r:None if r.url.startswith(('app://kubono/','data:','blob:')) else outside.append(r.url))
  page.wait_for_function(ready,timeout=30000)
  kept=page.evaluate("({sparks:__r.S.sparks,crystals:__r.S.pathCrystals.length,first:__r.S.pathCrystals[0]})")
  assert kept=={'sparks':57,'crystals':10,'first':'desk:0'},kept
  page.mouse.click(640,480);page.wait_for_function("window.__r.ac?.state==='running'",timeout=10000)
  page.wait_for_timeout(800)
  assert not outside,outside
  assert not errors,errors
  page.evaluate('window.close()')
  wait_exit(proc,'second run')
  assert not [l for l in log.read_text(errors='replace').splitlines() if l.startswith('[kubono] blocked')],'nothing blocked on the second run'
  assert not proxied,'connections from the second run: '+str(proxied)
 print(f'PASS desktop: Linux build opens a 1280x800 window titled Kubono with the sale edition from app://kubono, a real F11 is taken by the wrapper while other keys reach the game, a click starts the sound, a {size}-byte save in ~/.config/{APP_ID} survives quitting and reopening, closing the window quits with code 0, the network is blocked (a probe fetch fails) and a recording proxy sees no connection from the page or Electron, no console errors ({time.time()-started:.0f}s)',flush=True)
finally:
 for proc in reversed(procs):
  if proc.poll() is None:
   try:os.killpg(proc.pid,signal.SIGTERM);proc.wait(timeout=10)
   except Exception:
    try:os.killpg(proc.pid,signal.SIGKILL)
    except Exception:pass
 for server in servers:server.shutdown()
 shutil.rmtree(work,ignore_errors=True)
