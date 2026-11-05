"""The second half of living_mix.py: the same renders and checks for the rest of the living catalogue."""
from pathlib import Path
import subprocess,sys
sys.exit(subprocess.call([sys.executable,str(Path(__file__).resolve().parent/'living_mix.py'),'1']))
