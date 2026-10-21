"""Cube shop batch 5: six bought pulse voices and the walking sounds over dense native genres."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
VOICES=['voice:808','voice:bell','voice:acid','voice:vocal','voice:scratch','voice:chord']
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async voices=>{const {renderMix}=await import('/tests/audio_mix.mjs'),out=[];
   for(const [i,genre]of ['minimaltechno','deep','afro','ambient','dnb','acid'].entries()){const r=await renderMix(genre,{dense:true,soft:i%2===1,sampleRate:i%2===1?44100:48000,shopPieces:[voices[i]]});out.push({kind:'voice',piece:voices[i],genre,peak:r.peak,hotFraction:r.hotFraction,notes:r.shopNotes.length,ids:[...new Set(r.shopNotes.map(n=>n.id))]});}
   for(const [i,genre]of ['deep','minimaltechno'].entries()){const r=await renderMix(genre,{dense:true,journeyMotion:{vx:i?-120:120,vy:0},shopPieces:['sound:hat','sound:filter','sound:antenna','trail:notes','voice:808']});out.push({kind:'walk',genre,peak:r.peak,hotFraction:r.hotFraction,sounds:r.shopSounds});}
   return out;}''',VOICES)
  for row in rows:
   assert 0<row['peak']<.96 and row['hotFraction']==0,row
   if row['kind']=='voice':assert row['notes']>0 and row['ids']==[row['piece']],row
   else:assert row['sounds']['hat']>0 and row['sounds']['filter']>0,row
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'sampleRates':[44100,48000],'rows':rows};(ROOT/'scripts/shop-sound-audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
  print('PASS six bought pulse voices and walking cube sounds over dense native genres at 44.1/48 kHz; peak '+str(report['maxPeak']),flush=True);browser.close()
finally:server.shutdown()
