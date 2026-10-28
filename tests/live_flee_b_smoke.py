"""Living encounters, batch 2 (Jay, 27 Oct 2026): four more «huir» (Esporas, Anillos, Prisma, Púlsares), each forced with
«?encuentro=<id>» and played to its three endings (live_flee_helpers.py): out with pulses on time for 15 ✦ (the
Bitácora and one notice the first time), out on foot for 10 ✦, reached for nothing but a kind goodbye and a short
nudge. Screenshots at 390×844."""
from playwright.sync_api import sync_playwright
import os,shutil,json
import live_flee_helpers as H
server=H.start()
try:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),args=['--no-sandbox'])
  shots=[]
  for i,kind in enumerate(['polen','arena','rayos','ondas']):
   p=H.flee(browser,kind,shot=kind in ('arena','rayos'),toast=i==0)
   if p:shots.append(str(p))
  browser.close()
 print('PASS living encounters, batch 2 (b): polen, arena, rayos and ondas forced with «?encuentro=», ahead with their line; out with pulses on time 15 ✦ (Bitácora and one notice the first time), on foot 10 ✦, reached nothing given or taken and a short nudge; screenshots '+json.dumps(shots),flush=True)
finally:server.shutdown()
