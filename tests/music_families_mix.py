"""Actual six-family production audio, source traces and exported listening examples."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,threading,json,base64
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT.parent.parent/'outputs';OUT.mkdir(exist_ok=True)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox'])
  page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=[]
  for index,(genre,family) in enumerate([('nudisco','funk'),('dub','dub'),('jazztronica','jazz'),('afro','afro'),('organic','folk'),('ambient','chamber')]):
   row=page.evaluate('''async args=>{const {renderMix}=await import('/tests/audio_mix.mjs');let wav;window.__mixCapture=b=>{const n=b.length,ab=new ArrayBuffer(44+n*4),v=new DataView(ab),str=(o,s)=>[...s].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));str(0,'RIFF');v.setUint32(4,36+n*4,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,b.sampleRate,true);v.setUint32(28,b.sampleRate*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,n*4,true);for(let c=0;c<2;c++){const data=b.getChannelData(c);for(let i=0;i<n;i++)v.setInt16(44+i*4+c*2,Math.round(Math.max(-1,Math.min(1,data[i]))*32767),true);}const bytes=new Uint8Array(ab);let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));wav=btoa(s);};try{const r=await renderMix(args.genre,{productionFoundation:true,dense:true,renderSeconds:20,sampleRate:args.rate});return {genre:r.genre,family:r.musicFamily,peak:r.fullPeak,hot:r.hotFraction,rms:r.rmsDb,instruments:r.instrumentHits,notes:r.audioNotes,wav};}finally{delete window.__mixCapture;}}''',{'genre':genre,'rate':44100 if index%2 else 48000})
   assert row['family']==family,row
   assert 0<row['peak']<.96 and row['hot']==0,row
   assert row['notes'] and all(n.get('origin')!='track' or n['instrument']!='bell' for n in row['notes']),row
   (OUT/f'music-family-{family}.wav').write_bytes(base64.b64decode(row.pop('wav')))
   rows.append(row);print('PASS audio '+family+' peak '+str(row['peak']),flush=True)
  idle=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs');const r=await renderMix('heart',{caminoIdle:true,renderSeconds:30,sampleRate:44100});return {peak:r.fullPeak,instruments:r.instrumentHits};}''')
  assert idle['instruments'].get('bell',0)==0 and idle['instruments'].get('glass',0)==0,idle
  (ROOT.parent/'music-families-audio.json').write_text(json.dumps({'mixes':rows,'idle':idle},indent=2)+'\n',encoding='utf-8')
  browser.close();print('PASS six dense 20-second production renders, 44.1/48 kHz, exported WAVs, source traces, no clipping and 30-second Camino no automatic bell/glass',flush=True)
finally:server.shutdown();server.server_close()
