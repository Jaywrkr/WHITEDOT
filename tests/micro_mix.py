"""Ten original microinstrument families and five trails over the real production scheduler."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
import threading,shutil,os,json
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Handler,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox']);page=browser.new_page();page.expose_function('__mixProgress',lambda row:print('Rendered '+str(row),flush=True));page.goto(f'http://127.0.0.1:{server.server_port}/')
  rows=page.evaluate('''async()=>{const {renderMix}=await import('/tests/audio_mix.mjs'),{MICRO_IDS}=await import('/src/micro-instruments-model.js'),out=[];
   for(const [i,id]of MICRO_IDS.entries())for(const parameter of [.05,.95]){const r=await renderMix(['minimaltechno','deep','afro','ambient','dnb'][i%5],{scene:'micro:'+id,productionFoundation:true,dense:true,renderSeconds:8,sampleRate:parameter<.5?44100:48000,microParameter:parameter});out.push({kind:id,parameter,peak:r.fullPeak,rms:r.rmsDb,notes:r.microNotes,onsets:r.conductorOnsets});}
   for(const id of ['arcos','cintas','diamantes','puntos','duplicador']){const r=await renderMix('deep',{scene:'surprise:'+id,productionFoundation:true,dense:true,renderSeconds:10});out.push({kind:id,peak:r.fullPeak,rms:r.rmsDb,notes:r.microNotes,trails:r.surpriseNotes,onsets:r.conductorOnsets});}return out;}''')
  (ROOT/'scripts/posmusica-06-audio.json').write_text(json.dumps({'renders':len(rows),'rows':rows},indent=2)+'\n')
  for row in rows:
   assert 0<row['peak']<.96 and -60<row['rms']<-3,row
   assert row['notes'],row
   assert all(n['time']>=0 and 30<=n['note']<=81 for n in row['notes']),row
   assert all(all(any((pitch-tone)%12==0 for tone in n['tones']) for pitch in n['pitches']) for n in row['notes'] if n['role'] in ['acorde','bajo'] or n['strongBeat']),row
   assert row['onsets'] and max(n['errorSeconds'] for n in row['onsets'])<.011,row
   if row.get('trails'):
    assert len(row['trails'])<=12,row
   elif row['kind'] in ['arcos','cintas','diamantes','puntos','duplicador']:raise AssertionError('trail did not emit: '+str(row))
  report={'renders':len(rows),'maxPeak':max(r['peak'] for r in rows),'sampleRates':[44100,48000],'rows':[{**{k:v for k,v in r.items() if k not in ['onsets','trails']},'maxOnsetErrorSeconds':max(n['errorSeconds'] for n in r['onsets']),'emittedNotes':len(r['notes']),'trailNotes':len(r.get('trails',[]))} for r in rows]}
  (ROOT/'scripts/posmusica-06-audio.json').write_text(json.dumps(report,indent=2)+'\n')
  print('PASS ten microinstrument families, pressure/filter extremes and five tempo-bound trails over dense production at 44.1/48 kHz',flush=True);browser.close()
finally:server.shutdown()
