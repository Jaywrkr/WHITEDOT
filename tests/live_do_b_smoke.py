"""Living encounters, batch 3 (Jay, 28 Oct 2026): four more «hacer» (Esporas, Anillos, Prisma, Púlsares), each forced with
«?encuentro=<id>» and played to its three endings (live_do_helpers.py): done with pulses on time for more ✦ (the Bitácora
and one notice the first time), done on foot for its ✦, walking away for nothing but a kind goodbye. Screenshots at
390×844."""
from playwright.sync_api import sync_playwright
import os,shutil,json
import live_do_helpers as H
server=H.start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  shots=[]
  for i,kind in enumerate(['brotes','caravana','nodos','pulsares']):
   p=H.task(browser,kind,shot={'brotes':1200,'caravana':1200,'nodos':4400}.get(kind,0),toast=i==0)
   if p:shots.append(str(p))
  browser.close()
 print('PASS living encounters, batch 3 (b): brotes, caravana, nodos and pulsares forced with «?encuentro=», ahead with their line; done with pulses on time more ✦ (Bitácora and one notice the first time), on foot its ✦, walking away nothing given or taken; screenshots '+json.dumps(shots),flush=True)
finally:server.shutdown()
