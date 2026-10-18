"""All original discovery motifs over dense native mixes, plus a real idle Camino render."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import os,threading,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox'])
  page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{WONDERS}=await import('/src/musical-wonders-model.js');const out=[];for(let i=0;i<5;i++){const batch=WONDERS.slice(i*4,i*4+4).map(d=>d.id),row=await renderMix(['minimaltechno','ambient','dnb','deep','dub'][i],{dense:true,wonderBatch:batch,totems:i===0?['stack','orb','bottle']:i===1?['hourglass','diamond','spire']:null,renderSeconds:16,sampleRate:i%2?44100:48000});out.push({genre:row.genre,peak:row.fullPeak,hotFraction:row.hotFraction,notes:row.wonderNotes,instruments:row.instrumentHits});}const idle=await renderMix('minimaltechno',{caminoIdle:true,renderSeconds:30,sampleRate:44100});return {mixes:out,idle:{peak:idle.fullPeak,bells:idle.instrumentHits.bell||0,instruments:idle.instrumentHits}};}''')
  seen=set()
  for row in rows['mixes']:
   assert 0<row['peak']<.96 and row['hotFraction']==0,row
   assert len(row['notes'])==24,row
   for note in row['notes']:
    seen.add(note['id']);assert 48<=note['note']<=84 and note['gain']<=.024
  assert len(seen)==20
  assert rows['idle']['bells']==0,rows['idle']
  (ROOT.parent/'wonders-audio.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8')
  print('PASS 20 original motifs in five dense native renders at 44.1/48 kHz; no clipping; peak '+str(max(r['peak'] for r in rows['mixes']))+'; 30-second idle Camino: zero automatic bells',flush=True)
  browser.close()
finally:server.shutdown();server.server_close()
