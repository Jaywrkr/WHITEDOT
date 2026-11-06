"""Store media from the real game (D08/D09): screenshots at store sizes in Spanish and English, icon and graphic exports,
and short clips with the game's own music.

Usage: python3 scripts/store-media.py [--out outputs/tienda] [--only capturas,iconos,clips,master] [--sizes movil,escritorio] [--langs es,en] [--scenes 8-refugio]
Everything is rendered by the game itself in Chromium; nothing is painted over it. Output stays out of Git (outputs/).
Listo 2 (alpha.274): every scene starts from a new save of the open World («?abierto=1»: no Journey, no Camino), as a
player meets it: the first minute with the guide and «Llanura · más lejos · 0,5 km», then the scanner's marks on the
edge, a place's portal, a round, its sheet of ★, Tu cubo (Piezas), the Bitácora and the Refugio.
Listo 3 (alpha.275): the round is played, as a player does: the music runs, the place sings its bar, and then the cube
pulses on the steps it asks for through the game's own pulse (the Space key's), so the Line and the cube show the hits.
The Refugio waits for its first line to be written whole. A third clip shows a round.
Listo 4 (alpha.277): the clips' audio is mastered (one fixed gain, no pumping; a fast limiter only for a lone spike) to about
−16 LUFS with its true peak at −1 dBTP or lower; «--only master» does it again on the clips already in --out without recording.
On a phone the Refugio's Voz no longer covers a room's name, so its still keeps the Voz. «--scenes 8-refugio» takes
only that still."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,os,shutil,argparse,base64,subprocess,json
ROOT=Path(__file__).resolve().parents[1]
SIZES=[('movil',360,640,3),('tablet',800,1280,2),('iphone-6-9',440,956,3),('ipad-13',1032,1376,2),('escritorio',1280,720,1.5)]
ap=argparse.ArgumentParser();ap.add_argument('--out',default=str(ROOT/'outputs'/'tienda'));ap.add_argument('--only',default='capturas,iconos,clips')
ap.add_argument('--sizes',default=','.join(s[0] for s in SIZES));ap.add_argument('--langs',default='es,en');ap.add_argument('--scenes',default='');args=ap.parse_args()
OUT=Path(args.out);ONLY=set(args.only.split(','));WANT=set(args.sizes.split(','));LANGS=args.langs.split(',');SCENES=set(filter(None,args.scenes.split(',')))
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
# A player's new save of the open World: automated browsers keep their old start unless «?abierto=1» asks for this one.
URL=f'http://127.0.0.1:{server.server_port}/?abierto=1'
READY="!!window.__r?.ringState&&__r.inWorld()&&__r.ringState().active"
HIDE="document.querySelectorAll('.modal,#returnEntrance').forEach(m=>m.hidden=true)"
# Passing notices are part of play but cover the scene in a still; they are hidden for captures only. The guide is
# shown in the first scene and hidden after it (GUIDE).
QUIET="#toast,#phrase,#zone,#celebration,#rareNotice,#sparkGain{visibility:hidden!important}"
GUIDE="#firstJourney{visibility:hidden!important}"
# After the first minute: three weeks of play, three places complete (Llanura, Lago, Bosque: the radar at level 4 and
# Ámbar earned), sparks spent on a hat and a pet, the Refugio dressed. Still the open World: no Journey, no Camino.
LIVED="""async()=>{"""+HIDE+""";const r=__r,s=r.S;s.totalDays=21;s.firstJourney.skipped=true;s.playerProfile={...(s.playerProfile||{}),name:''};
 const d=r.placesData();for(const id of ['llanura','lago','bosque'])d.stars[id]=[true,true,id==='llanura'];d.seen={...(d.seen||{}),llanura:true,lago:true,bosque:true};const P=await import('/src/places.js'),sea=(x,y)=>!!r.regionOfPos?.(x,y)?.sea;for(const id of ['llanura','lago','bosque'])d.found[id]||=P.legacySpot(id,sea);
 s.sparks=2000;s.sparkEconomy.earned=s.sparkEconomy.spent+2000;for(const id of ['acc:hat','pet:cloud'])r.buySparkStyle?.(id);
 s.livingSeen={...(s.livingSeen||{}),moth:true,deer:true};const m=await import('/src/house-capsules.js');s.house={...s.house,decor:m.CAPSULE_PIECES.map(p=>({id:p.id,room:p.room,x:p.x,y:p.y}))};
 s.sparks=480;s.sparkEconomy.earned=s.sparkEconomy.spent+480;r.save();r.liveEncounterRest?.();}"""
# A lively spot of the World, away from the sea.
PLACE="""()=>{const r=__r,ids=r.BIOMES.map(b=>b.id);for(const want of ['cristales','bosque','jardin','faros'])for(let d=1;d<40;d++)for(let a=0;a<16;a++){const x=Math.round(Math.cos(a/16*6.283)*d*300),y=Math.round(Math.sin(a/16*6.283)*d*300);if(ids[r.biomeOfPos(x,y)]===want&&!r.regionOfPos(x,y)?.sea){r.S.wx=x;r.S.wy=y;return want;}}return null;}"""
# The Llanura's portal on screen: the cube a few steps from it, on the side of the origin.
PORTAL="""()=>{const r=__r,f=r.S.lugares.found.llanura;if(!f)return false;const d=Math.hypot(f.x,f.y)||1;r.S.wx=Math.round(f.x-f.x/d*150);r.S.wy=Math.round(f.y-f.y/d*150);return true;}"""
# Playing a round for `ms`: a pulse (runtime.sonar, the Space key's) each time the music, as heard, passes a step the
# place counts (runtime.journeyRhythmTarget, the round's own judge), stamped with the moment it was heard, as a touch
# carries its own time: a slow frame on a large screen does not move it. It ends just after a hit, while its mark is fresh on the Line, once ten hits in a row light the cube's trail.
PLAY="""async(ms)=>{const r=__r,J=await import('/src/journey-pulse.js'),end=performance.now()+ms,give=performance.now()+ms+12000;let done=-1,hitAt=0;
 return await new Promise(res=>{const tick=()=>{const now=performance.now(),heard=J.audibleTime(r.ac),t=r.journeyRhythmTarget(heard)?.hit;
  if(t&&t.time<=heard&&heard-t.time<.4&&t.time>done+.01){done=t.time;r.sonar('player',now-(heard-t.time)*1000);hitAt=now;}
  if(now<give&&(now<end||!hitAt||now-hitAt>90||(r.ritmoState?.().combo|0)<10))requestAnimationFrame(tick);else res(r.journeyPulseState());};tick();});}"""
# Whether the Voz covers a text the Refugio drew (its rooms' names), from the house's own layout: it must not.
COVERS="""()=>{const v=document.getElementById('voice').getBoundingClientRect();return __r.houseLayout().texts.some(t=>t.x<v.right&&v.left<t.x+t.w&&t.y<v.bottom&&v.top<t.y+t.h);}"""
# The round's sheet: the Lago played to about three pulses in four on time in about a minute.
RESULT="""()=>{const r=__r;for(let i=0;i<500;i++)r.placeHear('lago',i<373,{});const real=Date.now,now=real();r.S.lugares.run.startedAt=now-59999;Date.now=()=>now;try{r.placeFinish('lago');}finally{Date.now=real;}}"""
def page_for(b,w,h,dpr,lang,sound=False):
 ctx=b.new_context(viewport={'width':w,'height':h},device_scale_factor=dpr,**({'record_video_dir':str(OUT/'_video'),'record_video_size':{'width':w,'height':h}} if sound else {}))
 p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.add_init_script(f"try{{localStorage.setItem('kubono:lang','{lang}')}}catch(_){{}}")
 # Whatever reaches the speakers also feeds a stream we can record.
 if sound:p.add_init_script("(()=>{const connect=AudioNode.prototype.connect;AudioNode.prototype.connect=function(t,...a){const r=connect.call(this,t,...a);if(t instanceof AudioDestinationNode){const c=this.context;c.__tap||=c.createMediaStreamDestination();window.__tap=c.__tap;connect.call(this,c.__tap);}return r;};})()")
 p.route('**/src/main.js',lambda r:r.fulfill(body=(ROOT/'src/main.js').read_text(encoding='utf-8').replace('await requireAccount()','null')+'\nwindow.__r=runtime;',content_type='text/javascript'))
 p.goto(URL);p.wait_for_function(READY,timeout=30000);p.add_style_tag(content=QUIET);p.evaluate(f"()=>{{{HIDE};__r.S.sound={'true' if sound else 'false'};__r.stopAutopilot?.();}}")
 assert p.evaluate('__r.S.journey.open===true&&!__r.S.pathCrystals?.length'),'a new save of the open World'
 assert p.evaluate('__r.lang')==lang,('language',lang)
 p.wait_for_timeout(600);p.__errors=errors;return ctx,p
def clean(p):p.evaluate(HIDE);p.wait_for_timeout(200)
def scenes(p,prefix):
 shots=[]
 def snap(name,hide=True):
  if hide:clean(p)
  path=OUT/'capturas'/f'{prefix}-{name}.png';p.screenshot(path=str(path));shots.append(path.name)
 if SCENES=={'8-refugio'}:
  p.add_style_tag(content=GUIDE);p.evaluate(LIVED);p.wait_for_timeout(300);refugio(p,snap);return shots
 assert not SCENES,('--scenes takes only 8-refugio',SCENES)
 # 1 · The first minute: the guide and the line to the first place.
 p.wait_for_function("!document.getElementById('ringRoute').hidden",timeout=8000);p.wait_for_timeout(1200);snap('1-inicio')
 p.add_style_tag(content=GUIDE);p.evaluate(LIVED);p.wait_for_timeout(300);home=p.evaluate("[__r.S.wx,__r.S.wy]")
 # 2 · The scanner: a held finger, and what is near becomes marks on the edge of the screen.
 p.evaluate(PLACE);p.wait_for_timeout(1500);clean(p)
 w,h=p.viewport_size['width'],p.viewport_size['height'];p.mouse.move(w/2+70,h/2-90);p.mouse.down();p.wait_for_timeout(1800)
 marks=p.evaluate("__r.scanState().marks.length");snap('2-escaner',hide=False);p.mouse.up()
 # The marks fade by themselves; the next scene starts with a clean view.
 p.wait_for_function('__r.scanState().marks.length===0',timeout=20000);p.wait_for_timeout(300)
 assert marks>0,'the scanner found nothing to show'
 # 3 · A place's portal.
 assert p.evaluate(PORTAL);p.wait_for_timeout(2200);snap('3-portal')
 # 4 · A round: the place sings its bar, then the cube plays it.
 # The music runs for this scene only (the clips record it); the stills elsewhere stay silent.
 p.evaluate("()=>{__r.S.sound=true;__r.audio();}");p.wait_for_function("__r.ac?.state==='running'",timeout=10000)
 # The round is played back where the save starts, a calm spot with the counters clear.
 p.evaluate("([x,y])=>{__r.S.wx=x;__r.S.wy=y;}",home);p.wait_for_timeout(600);assert p.evaluate("__r.startPlace('lago')"),'the Lago opens';p.wait_for_timeout(300);p.wait_for_function('!__r.rhythmDemo()',timeout=20000)
 clean(p);played=p.evaluate(PLAY,6000);assert played and played['hits']>=10,('the round was played',played);print(prefix,'round',played['hits'],'on time',played['misses'],'off',flush=True);p.screenshot(path=str(OUT/'capturas'/f'{prefix}-4-ronda.png'));shots.append(f'{prefix}-4-ronda.png')
 p.evaluate("()=>{__r.S.sound=false;}")
 # 5 · Its sheet of ★.
 p.evaluate(RESULT);p.wait_for_function("!document.getElementById('mPlace').hidden",timeout=20000);p.wait_for_timeout(900);snap('5-resultado',hide=False)
 p.evaluate(HIDE);p.wait_for_timeout(600)
 # 6 · Tu cubo, Piezas: looks traded for sparks earned by playing.
 p.evaluate("()=>{"+HIDE+";document.getElementById('bCube').click();}");p.wait_for_timeout(300);p.evaluate("document.getElementById('cubeTabShop').click()");p.wait_for_timeout(600);snap('6-cubo',hide=False)
 # 7 · The Bitácora.
 p.evaluate("()=>{"+HIDE+";__r.openJournal('achievements');}");p.wait_for_timeout(600);snap('7-bitacora',hide=False)
 # 8 · The Refugio.
 refugio(p,snap)
 return shots
def refugio(p,snap):
 p.evaluate("()=>{"+HIDE+";__r.landHouse();}");p.wait_for_function('__r.houseSettled()',timeout=15000)
 # Its first line («Tu Refugio viaja contigo. Se abre donde estés.»), written whole before the still, beside the rooms'
 # names and never over them (a phone's house steps up and leaves it a band, house.js voiceSlot).
 p.wait_for_function("document.getElementById('voice').classList.contains('on')&&document.getElementById('vX').textContent.length>40",timeout=15000);p.wait_for_timeout(900)
 assert p.evaluate("(x=>x.scrollHeight<=x.clientHeight+1)(document.getElementById('vX'))"),'the Refugio line fits'
 assert not p.evaluate(COVERS),'the Voz covers a room name'
 snap('8-refugio')
 assert not p.__errors,p.__errors
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
def clip(b,name,w,h,dpr,seconds,steps,lang):
 ctx,p=page_for(b,w,h,dpr,lang,sound=True);p.evaluate("()=>{const r=__r;r.audio();}");p.wait_for_function("__r.ac?.state==='running'&&!!window.__tap")
 p.evaluate("""()=>{window.__chunks=[];const m=new MediaRecorder(window.__tap.stream,{mimeType:'audio/webm'});m.ondataavailable=e=>__chunks.push(e.data);m.start();window.__rec=m;}""")
 started=p.evaluate('performance.now()')
 for kind,arg in steps:
  if kind=='js':p.evaluate(arg)
  elif kind=='wait':p.wait_for_timeout(arg)
  elif kind=='css':p.add_style_tag(content=arg)
  clean(p)
 p.wait_for_timeout(max(0,int(seconds*1000-(p.evaluate('performance.now()')-started))))
 audio=p.evaluate("""()=>new Promise(res=>{__rec.onstop=async()=>{const b=new Blob(__chunks,{type:'audio/webm'}),buf=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<buf.length;i+=32768)s+=String.fromCharCode(...buf.subarray(i,i+32768));res(btoa(s));};__rec.stop();})""")
 video=p.video.path();ctx.close();a=OUT/'_video'/f'{name}.webm';a.write_bytes(base64.b64decode(audio))
 # The recording starts when the page opens; keep only the last `seconds`.
 total=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',video],capture_output=True,text=True).stdout.strip() or seconds)
 subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(max(0,total-seconds)),'-i',video,'-i',str(a),'-map','0:v','-map','1:a','-shortest','-vf','scale=iw*2:ih*2:flags=neighbor','-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k',str(OUT/'clips'/f'{name}.mp4')],check=True)
 master(OUT/'clips'/f'{name}.mp4');return f'{name}.mp4'
# The clip's audio: about −16 LUFS, true peak −1 dBTP or lower. One fixed gain for the whole clip (no pumping); a fast
# limiter, oversampled, only where a lone transient would still pass −2 dBTP. The picture is copied as it is. A clip
# already there is left alone.
def loudness(path):
 out=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(path),'-map','0:a','-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True).stderr.split('Summary:')[-1]
 i=float(out.split('I:')[1].split()[0]);tp=float(out.split('True peak:')[1].split('Peak:')[1].split()[0]);return {'lufs':i,'true_peak_db':tp}
def master(path):
 m=loudness(path)
 if -17.5<=m['lufs']<=-15.5 and m['true_peak_db']<=-1:return m
 gain=-16.5-m['lufs'];chain=f'volume={gain:.2f}dB'
 if m['true_peak_db']+gain>-2:chain+=',aresample=192000,alimiter=limit=0.7499:attack=1:release=60:level=0,aresample=48000'
 tmp=path.with_suffix('.master.mp4')
 subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(path),'-map','0:v','-map','0:a','-c:v','copy','-af',chain,'-ar','48000','-c:a','aac','-b:a','192k','-movflags','+faststart',str(tmp)],check=True)
 m=loudness(tmp);assert m['true_peak_db']<=-1 and -17.5<=m['lufs']<=-15.5,(path.name,m);tmp.replace(path);return m
# The World clip: the first seconds with the guide, then a walk through a lively spot.
WORLD=[('wait',3500),('css',GUIDE),('js',LIVED),('js',PLACE),('js','__r.startAutopilot?.()'),('wait',10000)]
HOUSE=[('css',GUIDE),('js',LIVED),('js',"()=>{"+HIDE+";__r.landHouse();}"),('wait',3000),('js',"__r.houseWalkTo('jardin',.5)"),('wait',4000),('js','__r.housePulse()'),('wait',4000)]
# A round: the place sings its bar, then the cube answers it on time.
ROUND=[('css',GUIDE),('js',LIVED),('wait',800),('js',"__r.startPlace('lago')"),('wait',300),('js',"()=>new Promise(res=>{const t=()=>__r.rhythmDemo()?requestAnimationFrame(t):res();t();})"),('js',"()=>("+PLAY+")(8000)")]
# A partial run (some sizes, scenes or only the audio) keeps what the report already lists.
try:report=json.loads((OUT/'informe.json').read_text())
except Exception:report={}
def note(key,names):report[key]=sorted(set(report.get(key,[]))|set(names))
try:
 with sync_playwright() as pw:
  b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox','--autoplay-policy=no-user-gesture-required'])
  if 'capturas' in ONLY:
   (OUT/'capturas').mkdir(parents=True,exist_ok=True);shots=[]
   # Play phone 9:16 at 1080×1920 and tablet 1600×2560; Apple iPhone 6.9" 1320×2868 and iPad 13" 2064×2752; desktop/Steam 1920×1080.
   for prefix,w,h,dpr in SIZES:
    if prefix not in WANT:continue
    for lang in LANGS:
     ctx,p=page_for(b,w,h,dpr,lang);shots+=scenes(p,f'{prefix}-{lang}');ctx.close()
   note('capturas',shots)
  if 'iconos' in ONLY:
   ctx=b.new_context();p=ctx.new_page();p.goto(URL);p.wait_for_load_state()
   for name,size,pad,alpha in [('icono-1024-apple',1024,0,False),('icono-512-play',512,0,False),('icono-256-steam',256,0,False),('icono-adaptativo-432',432,.17,False)]:save(p.evaluate(MARK,[size,pad,alpha]),OUT/'iconos'/f'{name}.png')
   for name,w,h,line in [('grafico-play-1024x500',1024,500,'Un cubo. Un universo que suena.'),('steam-capsula-principal-1232x706',1232,706,'Un cubo. Un universo que suena.'),('steam-capsula-cabecera-920x430',920,430,'Un cubo. Un universo que suena.'),('steam-capsula-pequena-462x174',462,174,''),('steam-biblioteca-600x900',600,900,'Un cubo. Un universo que suena.'),('og-1200x630',1200,630,'Un cubo. Un universo que suena.')]:save(p.evaluate(GRAPHIC,[w,h,'KUBONO',line]),OUT/'graficos'/f'{name}.png')
   note('iconos',[x.name for x in (OUT/'iconos').glob('*.png')]);note('graficos',[x.name for x in (OUT/'graficos').glob('*.png')]);ctx.close()
  if 'clips' in ONLY:
   (OUT/'clips').mkdir(parents=True,exist_ok=True);(OUT/'_video').mkdir(parents=True,exist_ok=True);clips=[]
   for lang in LANGS:
    clips.append(clip(b,f'clip-mundo-vertical-{lang}',540,960,1,14,WORLD,lang))
    clips.append(clip(b,f'clip-mundo-horizontal-{lang}',960,540,1,14,WORLD,lang))
    clips.append(clip(b,f'clip-ronda-vertical-{lang}',540,960,1,14,ROUND,lang))
   clips.append(clip(b,'clip-refugio-vertical',540,960,1,12,HOUSE,LANGS[0]));note('clips',clips)
  b.close()
 # The clips' audio, measured as a store hears it.
 if 'master' in ONLY or 'clips' in ONLY:
  report['audio']={x.name:master(x) for x in sorted((OUT/'clips').glob('*.mp4'))}
  for name,m in report['audio'].items():print(name,f"{m['lufs']:.1f} LUFS",f"{m['true_peak_db']:.1f} dBTP",flush=True)
finally:server.shutdown()
shutil.rmtree(OUT/'_video',ignore_errors=True)
(OUT/'informe.json').write_text(json.dumps(report,indent=1,ensure_ascii=False))
print('PASS store media: '+', '.join(f'{k} {len(v)}' for k,v in report.items())+' in '+str(OUT),flush=True)
