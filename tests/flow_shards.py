"""Split the browser and audio catalogues into CI shards of similar length.

Each flow goes to exactly one shard. The split is the longest-first greedy one over the seconds measured on CI
(tests/flow-durations.json); a flow not in the table counts as the median of its kind, so a new flow is never left out.
Ties go by name and by shard number, so every runner computes the same split.

  python3 tests/flow_shards.py --list browser 10      which flows each browser shard runs, with expected minutes
  python3 tests/flow_shards.py --list audio 8
  python3 tests/flow_shards.py --from-logs LOG...     print a new table from `gh run view RUN --log` outputs
"""
from pathlib import Path
import json,re,sys,datetime
ROOT=Path(__file__).resolve().parents[1]
TABLE=ROOT/'tests/flow-durations.json'
EXCLUDED_BROWSER=('offline_smoke.py','desktop_smoke.py')

def browser_flows(exclude=EXCLUDED_BROWSER):
 # desktop_smoke.py needs the Electron build; offline_smoke.py runs after the catalogue in the first shard.
 return sorted(p.name for p in (ROOT/'tests').glob('*smoke.py') if p.name not in exclude)

def durations():
 try:return {k:float(v) for k,v in json.loads(TABLE.read_text(encoding='utf-8')).items()}
 except (OSError,ValueError):return {}

def assign(flows,total,kind,preload=None):
 """Return total lists of flows. preload: seconds already planned in each shard (e.g. the offline check)."""
 table=durations();known=sorted(v for k,v in table.items() if k.endswith('_mix.py')==(kind=='audio'))
 fallback=known[len(known)//2] if known else 30.0
 cost={f:table.get(f,fallback) for f in flows}
 load=list(preload or [0.0]*total);shards=[[] for _ in range(total)]
 for f in sorted(flows,key=lambda f:(-cost[f],f)):
  i=min(range(total),key=lambda i:(load[i],i));shards[i].append(f);load[i]+=cost[f]
 return shards,load

def shard_of(flows,spec,kind,preload=None):
 """flows for 'index/total' (1-based); raises ValueError on a malformed or out-of-range spec."""
 shard,total=map(int,spec.split('/'))
 if not 1<=shard<=total<=len(flows):raise ValueError(spec)
 shards,_=assign(flows,total,kind,preload)
 # Keep the catalogue's own order inside a shard.
 return [f for f in flows if f in set(shards[shard-1])]

def from_logs(paths):
 """Seconds per flow from GitHub Actions logs: the time between one flow's PASS/FAIL line and the previous one."""
 prev={};out={}
 for path in paths:
  for line in open(path,encoding='utf-8',errors='ignore'):
   m=re.match(r'^((browser|audio) \(\d+\))\t[^\t]*\t﻿?(\S+?)\.\d+Z (.*)$',line.rstrip())
   if not m:continue
   job,kind,ts,msg=m.group(1),m.group(2),datetime.datetime.fromisoformat(m.group(3)),m.group(4)
   if kind=='audio':
    r=re.match(r'(RUN|PASS|FAIL) audio: (\S+)$',msg)
    if not r:continue
    if r.group(1)=='RUN':prev[job]=ts
    elif job in prev:out.setdefault(r.group(2),[]).append((ts-prev[job]).total_seconds())
   else:
    if msg=='RUN browser: creative_regression.py':prev[job]=ts;continue
    r=re.match(r'(PASS|FAIL) (\S+\.py)$',msg)
    if r and job in prev:out.setdefault(r.group(2),[]).append((ts-prev[job]).total_seconds());prev[job]=ts
 return {k:round(max(v)) for k,v in sorted(out.items())}

if __name__=='__main__':
 args=sys.argv[1:]
 if args[:1]==['--from-logs']:print(json.dumps(from_logs(args[1:]),indent=1,sort_keys=True));sys.exit()
 if len(args)!=3 or args[0]!='--list' or args[1] not in ('browser','audio'):raise SystemExit(__doc__)
 kind,total=args[1],int(args[2])
 if kind=='browser':flows=browser_flows();pre=[4.0]+[0.0]*(total-1)
 else:
  flows=[p.name for p in sorted((ROOT/'tests').glob('*_mix.py'))];pre=None
 shards,load=assign(flows,total,kind,pre);seen=[f for s in shards for f in s]
 assert sorted(seen)==sorted(flows) and len(seen)==len(set(seen)),'every flow exactly once'
 for i,(s,l) in enumerate(zip(shards,load),1):print(f'{kind} {i}/{total}: {len(s)} flows, ~{l/60:.1f} min: '+', '.join(sorted(s)))
 print(f'{len(flows)} flows, each in exactly one shard; longest shard ~{max(load)/60:.1f} min')
