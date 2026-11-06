#!/usr/bin/env python3
"""D09: cut the Kubono trailer (about 37 s) from the store clips and screenshots of scripts/store-media.py.

    python3 scripts/trailer.py --media outputs/tienda --out outputs/trailer [--langs es,en] [--formats h,v]

Writes trailer-LANG-1920x1080.mp4 (h) and trailer-LANG-1080x1920.mp4 (v) outside Git. Text cards use Geist Mono
from assets/fonts. The music is the game's own audio from the clips (mundo -> ronda -> refugio) with 1 s
crossfades, mastered in two loudnorm passes to -16 LUFS and a true peak under -1 dBTP, then measured with ebur128.
Requires ffmpeg and Pillow.
"""
import argparse, json, re, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'assets' / 'fonts'
FPS = 25
TARGET_I, TARGET_TP = -16.0, -1.5  # TP under -1 dBTP with room for the AAC encoder

TEXT = {
    'es': {'tagline': 'Un cubo. Un universo que suena.',
           'cards': ['Explora un universo abierto.', 'Once lugares. Cada uno más lejos.', 'La música responde a lo que haces.'],
           'end': 'Pronto · itch.io · Google Play'},
    'en': {'tagline': 'A cube. A universe that sounds.',
           'cards': ['Explore an open universe.', 'Eleven places. Each farther away.', 'The music answers what you do.'],
           'end': 'Soon · itch.io · Google Play'},
}
# Timeline in seconds. Audio: mundo 0-14 at t=0, ronda from 1 s at t=13, refugio from 0 at t=25 (1 s crossfades) -> 37 s.
# Each clip's picture is placed where its own sound plays, so the cube and the music stay in sync.
SEGMENTS = [
    ('title', 2.5), ('mundo', 8.5, 2.5), ('card0', 2.0), ('ronda', 8.0, 1.0), ('card1', 2.0),
    ('still:2-escaner', 1.0), ('still:3-portal', 1.0), ('still:6-cubo', 1.0), ('still:7-bitacora', 1.0),
    ('card2', 2.0), ('refugio', 5.0, 4.0), ('end', 3.0),
]
TOTAL = sum(s[1] for s in SEGMENTS)


def run(cmd, **kw):
    return subprocess.run(cmd, check=True, text=True, capture_output=True, **kw)


def font(weight, size):
    return ImageFont.truetype(str(FONTS / f'GeistMono-{weight}.ttf'), size)


def wrap(draw, text, f, width):
    lines, line = [], ''
    for word in text.split():
        test = (line + ' ' + word).strip()
        if line and draw.textlength(test, font=f) > width:
            lines.append(line); line = word
        else:
            line = test
    lines.append(line)
    if len(lines) == 2:  # balance two lines so no word is left alone
        words = text.split()
        stop = [i for i, w in enumerate(words[:-1], 1) if w.endswith('.')]
        if stop:  # a sentence break reads better than an even one
            return [' '.join(words[:stop[0]]), ' '.join(words[stop[0]:])]
        lines = min(([' '.join(words[:i]), ' '.join(words[i:])] for i in range(1, len(words))),
                    key=lambda p: max(draw.textlength(s, font=f) for s in p))
    return lines


def card(path, size, lines, icon=None):
    """lines: [(text, weight, size_px, colour)] centred as one block on pure black."""
    w, h = size
    im = Image.new('RGB', size, (0, 0, 0)); d = ImageDraw.Draw(im)
    blocks = []
    for text, weight, px, colour in lines:
        f = font(weight, px)
        for ln in wrap(d, text, f, w * 0.84):
            blocks.append((ln, f, px, colour))
    gap = 0.45
    height = sum(b[2] * (1 + gap) for b in blocks) + (icon[1] + 40 if icon else 0)
    y = (h - height) / 2
    if icon:
        ic = Image.open(icon[0]).convert('RGB').resize((icon[1], icon[1]), Image.LANCZOS)
        im.paste(ic, ((w - icon[1]) // 2, int(y))); y += icon[1] + 40
    for ln, f, px, colour in blocks:
        d.text(((w - d.textlength(ln, font=f)) / 2, y), ln, font=f, fill=colour); y += px * (1 + gap)
    im.save(path)


def audio(clips, tmp):
    """The three clip soundtracks crossfaded, then normalised in two passes."""
    raw, out = tmp / 'mix.wav', tmp / 'master.wav'
    run(['ffmpeg', '-y', '-i', clips['mundo'], '-ss', '1', '-i', clips['ronda'], '-i', clips['refugio'], '-filter_complex',
         '[0:a]atrim=0:14,asetpts=N/SR/TB[a0];[1:a]atrim=0:13,asetpts=N/SR/TB[a1];[2:a]atrim=0:12,asetpts=N/SR/TB[a2];'
         '[a0][a1]acrossfade=d=1:c1=tri:c2=tri[x];[x][a2]acrossfade=d=1:c1=tri:c2=tri,'
         f'afade=t=in:d=0.3,afade=t=out:st={TOTAL - 2}:d=2[a]', '-map', '[a]', '-ar', '48000', '-ac', '2', str(raw)])
    probe = run(['ffmpeg', '-i', str(raw), '-af', f'loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA=11:print_format=json', '-f', 'null', '-'])
    m = json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}', probe.stderr).group(0))
    run(['ffmpeg', '-y', '-i', str(raw), '-af',
         f"loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
         f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true",
         '-ar', '48000', str(out)])
    return out


def measure(path):
    err = run(['ffmpeg', '-nostats', '-i', str(path), '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
    summary = err[err.rfind('Summary:'):]
    i = float(re.search(r'I:\s+(-?[\d.]+) LUFS', summary).group(1))
    tp = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summary).group(1))
    return {'integrated_lufs': i, 'true_peak_dbtp': tp}


def build(media, out, lang, fmt):
    vertical = fmt == 'v'
    size = (1080, 1920) if vertical else (1920, 1080)
    w, h = size
    clips = {'mundo': str(media / 'clips' / f"clip-mundo-{'vertical' if vertical else 'horizontal'}-{lang}.mp4"),
             'ronda': str(media / 'clips' / f'clip-ronda-vertical-{lang}.mp4'),
             'refugio': str(media / 'clips' / 'clip-refugio-vertical.mp4')}
    t = TEXT[lang]
    scale = 1 if vertical else 1.25
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        card(tmp / 'title.png', size, [('Kubono', 'SemiBold', int(120 * scale), (255, 255, 255)),
                                       (t['tagline'], 'Regular', int(40 * scale), (200, 200, 200))])
        for i, text in enumerate(t['cards']):
            card(tmp / f'card{i}.png', size, [(text, 'Regular', int(56 * scale), (255, 255, 255))])
        card(tmp / 'end.png', size, [('Kubono', 'SemiBold', int(96 * scale), (255, 255, 255)),
                                     (t['end'], 'Regular', int(36 * scale), (170, 170, 170))],
             icon=(media / 'iconos' / 'icono-512-play.png', int(120 * scale)))
        inputs, chains = [], []
        fit = (f'scale={w}:{h}:force_original_aspect_ratio=decrease:flags=lanczos,'
               f'pad={w}:{h}:(ow-iw)/2:(oh-ih)/2:black,setsar=1,fps={FPS},format=yuv420p')
        for n, seg in enumerate(SEGMENTS):
            kind, dur = seg[0], seg[1]
            if kind in clips:
                inputs += ['-ss', str(seg[2]), '-t', str(dur), '-i', clips[kind]]
            elif kind.startswith('still:'):
                shot = f"{'movil' if vertical else 'escritorio'}-{lang}-{kind[6:]}.png"
                inputs += ['-loop', '1', '-framerate', str(FPS), '-t', str(dur), '-i', str(media / 'capturas' / shot)]
            else:
                inputs += ['-loop', '1', '-framerate', str(FPS), '-t', str(dur), '-i', str(tmp / f'{kind}.png')]
            chains.append(f'[{n}:v]{fit},trim=duration={dur},setpts=PTS-STARTPTS[v{n}]')
        master = audio(clips, tmp)
        k = len(SEGMENTS)
        graph = ';'.join(chains) + ';' + ''.join(f'[v{n}]' for n in range(k)) + \
            f'concat=n={k}:v=1:a=0,fade=t=in:d=0.5,fade=t=out:st={TOTAL - 1}:d=1[v]'
        dest = out / f'trailer-{lang}-{w}x{h}.mp4'
        run(['ffmpeg', '-y', *inputs, '-i', str(master), '-filter_complex', graph, '-map', '[v]', '-map', f'{k}:a',
             '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', str(FPS),
             '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', '-t', str(TOTAL), str(dest)])
    return dest


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--media', default=str(ROOT / 'outputs' / 'tienda'))
    ap.add_argument('--out', default=str(ROOT / 'outputs' / 'trailer'))
    ap.add_argument('--langs', default='es,en')
    ap.add_argument('--formats', default='h,v')
    a = ap.parse_args()
    media, out = Path(a.media), Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    report = {'duration_s': TOTAL, 'target': {'integrated_lufs': TARGET_I, 'true_peak_dbtp_max': -1.0}, 'files': {}}
    for lang in a.langs.split(','):
        for fmt in a.formats.split(','):
            dest = build(media, out, lang, fmt)
            m = measure(dest)
            report['files'][dest.name] = m
            print(dest, m, flush=True)
            if abs(m['integrated_lufs'] - TARGET_I) > 0.5 or m['true_peak_dbtp'] > -1.0:
                raise SystemExit(f'{dest.name} misses the master: {m}')
    (out / 'informe.json').write_text(json.dumps(report, indent=1, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
