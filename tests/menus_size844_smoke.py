"""Part of tests/menus_smoke.py (size844), split so each CI flow stays under 145 s."""
import os,runpy
from pathlib import Path
os.environ['MENUS_PART']='size844'
runpy.run_path(str(Path(__file__).with_name('menus_smoke.py')),run_name='__main__')
