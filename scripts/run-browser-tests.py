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
flows={'browser':['creative_regression.py','offline_smoke.py'],'audio':['production_mix.py','encounter_mix.py','audio_mix.py','depth_mix.py','glass_mix.py','ecology_mix.py','composition_mix.py','exploration_mix.py','pet_mix.py','percussion_mix.py','living_mix.py','celebration_mix.py','music_identity_mix.py','synth_bank_mix.py','world_family_mix.py','habitat_mix.py','modular_mix.py','hybrid_mix.py','foreground_mix.py','heritage_mix.py','memory_mix.py','wardrobe_mix.py','house_mix.py','walkers_mix.py','lab_music_mix.py','technique_mix.py','landscape_gestures_mix.py','lab_learning_mix.py','lab_evolution_mix.py','lab_genres_mix.py','experience_learning_mix.py','experience_garden_mix.py','performance_mix.py','music_direction_mix.py','territory_music_mix.py','ensemble_mix.py','energy_mix.py','foundation_mix.py','transition_mix.py']}
if mode not in flows:raise SystemExit('Use browser or audio')
# Keep named order, but never omit a newly added audio regression.
flows['audio']+=sorted(p.name for p in (ROOT/'tests').glob('*_mix.py') if p.name not in flows['audio'])
selected=flows[mode]
if mode=='audio' and os.environ.get('WHITEDOT_AUDIO_SHARD'):
 try:shard,total=map(int,os.environ['WHITEDOT_AUDIO_SHARD'].split('/'))
 except ValueError:raise SystemExit('WHITEDOT_AUDIO_SHARD must be index/total')
 if not 1<=shard<=total<=len(selected):raise SystemExit('Invalid audio shard')
 selected=selected[shard-1::total]
 print(f'Audio shard {shard}/{total}: '+', '.join(selected),flush=True)
for flow in selected:
 print(f'RUN {mode}: {flow}',flush=True)
 command=[sys.executable,str(ROOT/'tests'/flow)]
 if flow!='creative_regression.py':command=[sys.executable,str(ROOT/'scripts/browser-processes.py'),'--timeout=895',*command]
 result=subprocess.run(command,cwd=ROOT,timeout=900)
 print(('FAIL' if result.returncode else 'PASS')+f' {mode}: {flow}',flush=True)
 if result.returncode:raise SystemExit(result.returncode)
