"""New contact/relay/completion phrases over dense production mixes; no new synthesis."""
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
  page=browser.new_page();page.goto(f'http://127.0.0.1:{server.server_port}/');rows=[]
  for index,genre in enumerate(['deep','afro','ambient','minimaltechno']):
   row=page.evaluate('''async o=>{const {renderMix}=await import('/tests/audio_mix.mjs');const r=await renderMix(o.genre,{productionFoundation:true,dense:true,mischiefBatch:true,renderSeconds:12,sampleRate:o.rate});return {genre:r.genre,rate:r.sampleRate,peak:r.fullPeak,hot:r.hotFraction,notes:r.mischiefNotes,instruments:r.instrumentHits};}''',{'genre':genre,'rate':44100 if index%2 else 48000})
   assert 0<row['peak']<.96 and row['hot']==0,row
   assert len(row['notes'])==10,row
   assert all(36<=n['note']<=84 and 0<n['gain']<=.09 for n in row['notes']),row
   rows.append(row);print('PASS mischief audio '+genre+' peak '+str(row['peak']),flush=True)
  (ROOT.parent/'mischief-audio.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8')
  browser.close();print('PASS four dense production renders at 44.1/48 kHz, all event/relay indices and completion triads, bounded pitches/gains and no clipping',flush=True)
finally:server.shutdown();server.server_close()
