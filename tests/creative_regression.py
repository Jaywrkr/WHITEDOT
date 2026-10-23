"""Run actual browser flows, preserve failures, and keep per-flow output for review."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
import os,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
flows=sorted(p for p in (ROOT/'tests').glob('*smoke.py') if p.name!='offline_smoke.py')
# The principal existing journey also validates controls, Studio and reload.
if ROOT/'tests/smoke.py' not in flows:flows.append(ROOT/'tests/smoke.py')
# CI splits the catalogue across runners (WHITEDOT_BROWSER_SHARD=index/total): every flow runs in exactly one shard,
# each runner has its own CPU, so flows no longer race each other on one shared machine.
if os.environ.get('WHITEDOT_BROWSER_SHARD'):
 try:shard,total=map(int,os.environ['WHITEDOT_BROWSER_SHARD'].split('/'))
 except ValueError:raise SystemExit('WHITEDOT_BROWSER_SHARD must be index/total')
 if not 1<=shard<=total<=len(flows):raise SystemExit('Invalid browser shard')
 flows=flows[shard-1::total]
 print(f'Browser shard {shard}/{total}: {len(flows)} flows',flush=True)
def run(path):
 result=subprocess.run([sys.executable,str(ROOT/'scripts/browser-processes.py'),'--timeout=145',sys.executable,str(path)],cwd=ROOT,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=150)
 (Path('/tmp')/('whitedot-review-'+path.stem+'.txt')).write_text(result.stdout)
 return path.name,result.returncode,result.stdout
failed=[]
workers=int(os.environ.get('WHITEDOT_BROWSER_WORKERS','2'))
if workers not in [1,2]:raise SystemExit('WHITEDOT_BROWSER_WORKERS must be 1 or 2')
with ThreadPoolExecutor(max_workers=workers) as pool:
 for future in as_completed([pool.submit(run,path) for path in flows]):
  try:name,code,output=future.result()
  except Exception as error:failed.append(str(error));print('FAIL '+str(error),flush=True);continue
  print(('PASS ' if code==0 else 'FAIL ')+name,flush=True)
  if code:
   failed.append(name);print(output[-3500:],flush=True)
   if os.environ.get('GITHUB_ACTIONS'):
    message=(name+'\n'+output[-2500:]).replace('%','%25').replace('\r','%0D').replace('\n','%0A');print('::error title=Browser journey failed::'+message,flush=True)
print(f'{len(flows)-len(failed)}/{len(flows)} browser flows passed',flush=True)
if failed:sys.exit(1)
