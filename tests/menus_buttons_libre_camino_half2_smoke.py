"""Part of tests/menus_smoke.py (buttons-libre-camino-half2), split so each CI flow stays under 145 s."""
import os,runpy
from pathlib import Path
os.environ['MENUS_PART']='buttons-libre-camino-half2'
runpy.run_path(str(Path(__file__).with_name('menus_smoke.py')),run_name='__main__')
