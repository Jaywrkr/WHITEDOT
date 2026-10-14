"""Use system Chromium or the pinned Playwright browser and preserve test exit codes."""
from pathlib import Path
import os,shutil,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
if not os.environ.get('CHROMIUM_PATH'):
 executable=shutil.which('chromium') or shutil.which('chromium-browser')
 if not executable:
  from playwright.sync_api import sync_playwright
  with sync_playwright() as p:executable=p.chromium.executable_path
 os.environ['CHROMIUM_PATH']=executable
mode=sys.argv[1] if len(sys.argv)>1 else 'browser'
flows={'browser':['creative_regression.py','offline_smoke.py'],'audio':['audio_mix.py','depth_mix.py','glass_mix.py','ecology_mix.py','composition_mix.py','exploration_mix.py','pet_mix.py','percussion_mix.py']}
if mode not in flows:raise SystemExit('Use browser or audio')
for flow in flows[mode]:
 result=subprocess.run([sys.executable,str(ROOT/'tests'/flow)],cwd=ROOT,timeout=900)
 if result.returncode:raise SystemExit(result.returncode)
