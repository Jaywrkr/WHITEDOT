"""Second half of round_close_smoke.py: rounds 5–9, the Lago card and the ring after the victory."""
import os,runpy
from pathlib import Path
os.environ['ROUND_CLOSE_PART']='b'
runpy.run_path(str(Path(__file__).with_name('round_close_smoke.py')),run_name='__main__')
