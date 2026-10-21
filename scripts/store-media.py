"""Store media from the real game (D08/D09): screenshots at store sizes, icon and graphic exports, and short clips with the game's own music.

Usage: python3 scripts/store-media.py [--out outputs/tienda] [--only capturas,iconos,clips]
Everything is rendered by the game itself in Chromium; nothing is painted over it. Output stays out of Git (outputs/)."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,argparse,base64,subprocess,json
ROOT=Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser();ap.add_argument('--out',default=str(ROOT/'outputs'/'tienda'));ap.add_argument('--only',default='capturas,iconos,clips');args=ap.parse_args()
OUT=Path(args.out);ONLY=set(args.only.split(','))
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
URL=f'http://127.0.0.1:{server.server_port}/'
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
# Passing notices are part of play but cover the scene in a still; they are hidden for captures only.
QUIET="#toast,#phrase,#celebration,#rareNotice,#firstJourney,#sparkGain{visibility:hidden!important}"
# A lived-in save: past the Camino, a few days, sparks spent on a hat and a pet, the whole house open and dressed.
SETUP="""async()=>{"""+HIDE+""";const r=__r,s=r.S;s.sound=%s;s.totalDays=21;s.firstJourney.skipped=true;s.pathCrystals=Array.from({length:10},(_,i)=>'shop:'+i);s.playerProfile={...(s.playerProfile||{}),name:''};
 r.enterWorld({automatic:true});s.sparks=2000;s.sparkEconomy.earned=s.sparkEconomy.spent+2000;for(const id of ['acc:hat','pet:cloud'])r.buySparkStyle?.(id);
 s.livingSeen={...(s.livingSeen||{}),moth:true,deer:true};const m=await import('/src/house-capsules.js');s.house={...s.house,decor:m.CAPSULE_PIECES.map(p=>({id:p.id,room:p.room,x:p.x,y:p.y}))};
 s.sparks=480;s.sparkEconomy.earned=s.sparkEconomy.spent+480;r.save();}"""
PLACE="""()=>{const r=__r,ids=r.BIOMES.map(b=>b.id);for(const want of ['cristales','bosque','jardin','faros'])for(let d=1;d<40;d++)for(let a=0;a<16;a++){const x=Math.round(Math.cos(a/16*6.283)*d*300),y=Math.round(Math.sin(a/16*6.283)*d*300);if(ids[r.biomeOfPos(x,y)]===want&&!r.regionOfPos(x,y)?.sea){r.S.wx=x;r.S.wy=y;return want;}}return null;}"""
def page_for(b,w,h,dpr,sound=False):
 ctx=b.new_context(viewport={'width':w,'height':h},device_scale_factor=dpr,**({'record_video_dir':str(OUT/'_video'),'record_video_size':{'width':w,'height':h}} if sound else {}))
 p=ctx.new_page()
 # Whatever reaches the speakers also feeds a stream we can record.
 if sound:p.add_init_script("(()=>{const connect=AudioNode.prototype.connect;AudioNode.prototype.connect=function(t,...a){const r=connect.call(this,t,...a);if(t instanceof AudioDestinationNode){const c=this.context;c.__tap||=c.createMediaStreamDestination();window.__tap=c.__tap;connect.call(this,c.__tap);}return r;};})()")
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(URL);p.wait_for_function('!!window.__r?.enterHouse');p.add_style_tag(content=QUIET);p.evaluate(SETUP%('true' if sound else 'false'));p.wait_for_timeout(600);return ctx,p
def clean(p):p.evaluate(HIDE);p.wait_for_timeout(200)
def scenes(p,prefix):
 shots=[]
 def snap(name):clean(p);path=OUT/'capturas'/f'{prefix}-{name}.png';p.screenshot(path=str(path));shots.append(path.name)
 p.evaluate(PLACE);p.evaluate('__r.startAutopilot?.()');p.wait_for_timeout(6000);snap('1-mundo')
 p.evaluate('__r.stopAutopilot?.()');p.evaluate("()=>{"+HIDE+";__r.landHouse();}");p.wait_for_function('__r.houseSettled()',timeout=15000);p.wait_for_timeout(400);snap('2-casa')
 p.evaluate(HIDE);p.locator('#houseOverview').click();p.wait_for_function('__r.houseSettled()');p.wait_for_timeout(400);snap('3-casa-entera');p.locator('#houseOverview').click()
 p.evaluate("()=>{const r=__r;for(const [k,v] of Object.entries({'0,0':'luz','0,4':'cristal','0,8':'luz','0,12':'cristal','1,2':'pilar','1,6':'loto','1,10':'pilar','1,14':'arbol','2,0':'flor','2,5':'luciernaga','2,11':'faro'}))r.S.studio.slots[k]=v;r.houseOpenWorkshop();}");p.wait_for_timeout(1200);snap('4-taller')
 p.evaluate("()=>{__r.houseBack();__r.exitHouse();}");p.wait_for_timeout(800)
 p.evaluate("()=>{"+HIDE+";document.getElementById('bCube').click();}");p.wait_for_timeout(300);p.evaluate("document.getElementById('cubeTabShop').click()");p.wait_for_timeout(600);p.screenshot(path=str(OUT/'capturas'/f'{prefix}-5-tienda.png'));shots.append(f'{prefix}-5-tienda.png')
 p.evaluate("()=>{"+HIDE+";__r.openJournal('achievements');}");p.wait_for_timeout(600);p.screenshot(path=str(OUT/'capturas'/f'{prefix}-6-bitacora.png'));shots.append(f'{prefix}-6-bitacora.png')
 return shots
# The icon keeps the approved mark: a white cube inside a gold ring on black.
MARK="""([size,pad,alpha])=>{const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');if(!alpha){x.fillStyle='#000';x.fillRect(0,0,size,size);}const s=size*(1-pad*2)/512,o=size*pad;x.translate(o,o);x.scale(s,s);x.strokeStyle='#f0d27a';x.lineWidth=5;x.beginPath();x.arc(256,256,161,0,6.283);x.stroke();x.fillStyle='#fff';x.fillRect(206,206,100,100);return c.toDataURL('image/png');}"""
GRAPHIC="""async([w,h,title,line])=>{await document.fonts.ready;const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,w,h);
 for(let i=0;i<Math.round(w*h/9000);i++){const a=(i*137.5)%w,b=(i*97.13+i*i*.37)%h;x.globalAlpha=.2+(i%5)*.15;x.fillStyle='#fff';x.fillRect(Math.round(a),Math.round(b),i%7?1:2,i%7?1:2);}x.globalAlpha=1;
 const u=Math.min(h/630,w/750),cy=h*.36,g=x.createRadialGradient(w/2,cy,0,w/2,cy,90*u);g.addColorStop(0,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='#fff';x.fillRect(Math.round(w/2-16*u),Math.round(cy-16*u),Math.round(32*u),Math.round(32*u));
 x.textAlign='center';x.fillStyle='#fff';x.font=`${Math.round(64*u)}px "Geist Mono", monospace`;x.fillText(title.split('').join(' '),w/2,h*.62);x.fillStyle='#ffffffbb';x.font=`${Math.round(28*u)}px "Geist Mono", monospace`;x.fillText(line,w/2,h*.74);return c.toDataURL('image/png');}"""
def save(data,path):
 blob=base64.b64decode(data.split(',',1)[1]);assert blob.startswith(b'\x89PNG') and len(blob)>500,f'{path.name} came out empty'
 path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(blob)
 # Stores reject icons and graphics with an alpha channel: flatten to RGB.
 tmp=path.with_suffix('.rgb.png');subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(path),'-pix_fmt','rgb24',str(tmp)],check=True);tmp.replace(path)
# A clip (recorded at half size, doubled with sharp pixels to 1080×1920 or 1920×1080): the game's own audio taken from its master bus while the screen is recorded, then joined with ffmpeg.
def clip(b,name,w,h,dpr,seconds,steps):
 ctx,p=page_for(b,w,h,dpr,sound=True);p.evaluate("()=>{const r=__r;r.audio();}");p.wait_for_function("__r.ac?.state==='running'&&!!window.__tap")
 p.evaluate("""()=>{window.__chunks=[];const m=new MediaRecorder(window.__tap.stream,{mimeType:'audio/webm'});m.ondataavailable=e=>__chunks.push(e.data);m.start();window.__rec=m;}""")
 started=p.evaluate('performance.now()')
 for kind,arg in steps:
  if kind=='js':p.evaluate(arg)
  elif kind=='wait':p.wait_for_timeout(arg)
  clean(p)
 p.wait_for_timeout(max(0,int(seconds*1000-(p.evaluate('performance.now()')-started))))
 audio=p.evaluate("""()=>new Promise(res=>{__rec.onstop=async()=>{const b=new Blob(__chunks,{type:'audio/webm'}),buf=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<buf.length;i+=32768)s+=String.fromCharCode(...buf.subarray(i,i+32768));res(btoa(s));};__rec.stop();})""")
 video=p.video.path();ctx.close();a=OUT/'_video'/f'{name}.webm';a.write_bytes(base64.b64decode(audio))
 # The recording starts when the page opens; keep only the last `seconds`.
 total=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',video],capture_output=True,text=True).stdout.strip() or seconds)
 subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(max(0,total-seconds)),'-i',video,'-i',str(a),'-map','0:v','-map','1:a','-shortest','-vf','scale=iw*2:ih*2:flags=neighbor','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k',str(OUT/'clips'/f'{name}.mp4')],check=True)
 return f'{name}.mp4'
report={}
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  if 'capturas' in ONLY:
   (OUT/'capturas').mkdir(parents=True,exist_ok=True);report['capturas']=[]
   # Play phone 9:16 at 1080×1920 and tablet 1600×2560; Apple iPhone 6.9" 1320×2868 and iPad 13" 2064×2752; desktop/Steam 1920×1080.
   for prefix,w,h,dpr in [('movil',360,640,3),('tablet',800,1280,2),('iphone-6-9',440,956,3),('ipad-13',1032,1376,2),('escritorio',1280,720,1.5)]:
    ctx,p=page_for(b,w,h,dpr);report['capturas']+=scenes(p,prefix);ctx.close()
  if 'iconos' in ONLY:
   ctx=b.new_context();p=ctx.new_page();p.goto(URL);p.wait_for_load_state()
   for name,size,pad,alpha in [('icono-1024-apple',1024,0,False),('icono-512-play',512,0,False),('icono-256-steam',256,0,False),('icono-adaptativo-432',432,.17,False)]:save(p.evaluate(MARK,[size,pad,alpha]),OUT/'iconos'/f'{name}.png')
   for name,w,h,line in [('grafico-play-1024x500',1024,500,'Un cubo. Un universo que suena.'),('steam-capsula-principal-1232x706',1232,706,'Un cubo. Un universo que suena.'),('steam-capsula-cabecera-920x430',920,430,'Un cubo. Un universo que suena.'),('steam-capsula-pequena-462x174',462,174,''),('steam-biblioteca-600x900',600,900,'Un cubo. Un universo que suena.'),('og-1200x630',1200,630,'Un cubo. Un universo que suena.')]:save(p.evaluate(GRAPHIC,[w,h,'KUBONO',line]),OUT/'graficos'/f'{name}.png')
   report['iconos']=sorted(x.name for x in (OUT/'iconos').glob('*.png'));report['graficos']=sorted(x.name for x in (OUT/'graficos').glob('*.png'));ctx.close()
  if 'clips' in ONLY:
   (OUT/'clips').mkdir(parents=True,exist_ok=True);(OUT/'_video').mkdir(parents=True,exist_ok=True);report['clips']=[]
   report['clips'].append(clip(b,'clip-mundo-vertical',540,960,1,14,[('js',PLACE),('js','__r.startAutopilot?.()'),('wait',13000)]))
   report['clips'].append(clip(b,'clip-casa-vertical',540,960,1,12,[('js',"()=>{"+HIDE+";__r.landHouse();}"),('wait',3000),('js',"__r.houseWalkTo('jardin',.5)"),('wait',4000),('js','__r.housePulse()'),('wait',4000)]))
   report['clips'].append(clip(b,'clip-mundo-horizontal',960,540,1,14,[('js',PLACE),('js','__r.startAutopilot?.()'),('wait',13000)]))
  b.close()
finally:server.shutdown()
shutil.rmtree(OUT/'_video',ignore_errors=True)
(OUT/'informe.json').write_text(json.dumps(report,indent=1,ensure_ascii=False))
print('PASS store media: '+', '.join(f'{k} {len(v)}' for k,v in report.items())+' in '+str(OUT),flush=True)
