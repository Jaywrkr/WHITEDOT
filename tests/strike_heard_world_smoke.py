"""Second part of strike_heard_smoke.py: touch to note and voices per step in the free World."""
import os,runpy
from pathlib import Path
os.environ['STRIKE_PART']='world'
runpy.run_path(str(Path(__file__).with_name('strike_heard_smoke.py')),run_name='__main__')
