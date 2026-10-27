"""Third part of strike_heard_smoke.py: still touches in the free World (pulse on down, scanner at 500 ms)."""
import os,runpy
from pathlib import Path
os.environ['STRIKE_PART']='hold'
runpy.run_path(str(Path(__file__).with_name('strike_heard_smoke.py')),run_name='__main__')
