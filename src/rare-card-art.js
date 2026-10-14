// Original small vector portraits, inspired by the world's own glyphs and materials.
// No external images, logos, recordings or characters.
const RELICS=[
 'M0 -22L19 11L-19 11Z','M20 0A20 20 0 1 1 -20 0A20 20 0 1 1 20 0','M-20 0H20M0 -20V20','M0 -22L22 0L0 22L-22 0Z',
 'M22 0A22 22 0 1 1 -22 0A22 22 0 1 1 22 0M-4 -4H4V4H-4Z','M-10 -23H10V-3H-10ZM-10 3H10V23H-10Z',
 'M-18 -18L18 18M18 -18L-18 18','M24 0L12 21L-12 21L-24 0L-12 -21L12 -21Z','M-22 8A22 22 0 0 1 22 8',
 'M-20 -2H-16V2H-20ZM-2 -2H2V2H-2ZM16 -2H20V2H16Z','M-12 -23V16H23','M-22 -22H22V22H-22ZM-4 -4H4V4H-4Z'
];
export function rarePortrait(card){
 const art=card.type.split(':')[0],v=card.artVariant||0;let path;
 if(art==='fossil')path='M23 5C29 -24 -10 -33 -25 -10C-38 16 -7 36 15 19C34 3 15 -18 -1 -12C-17 -8 -16 13 -2 14C10 15 13 2 4 -1';
 else if(art==='relic')path=RELICS[v%RELICS.length];
 else if(art==='petbox')path=card.type.endsWith('luciernaga')?'M-7 0C-7 -25 7 -25 7 0C7 21 -7 21 -7 0M-23 -8Q0 -35 23 -8M0 17V24':card.type.endsWith('grulla')?'M-30 -5Q-12 -25 0 0Q16 -22 29 -5M0 0Q14 -28 20 -24L25 -19':'M-30 -6Q-12 -27 0 0Q14 -25 30 -6M-9 8Q0 15 9 8';
 else if(art==='box')path={campo:'M27 0A27 27 0 1 1 -27 0A27 27 0 1 1 27 0M5 0A5 5 0 1 1 -5 0A5 5 0 1 1 5 0',cometa:'M-29 23L9 -12M-19 26L14 -6M20 -15A7 7 0 1 1 6 -15A7 7 0 1 1 20 -15',brujula:'M0 -29L9 -4L0 29L-9 4ZM-24 0H-14M14 0H24',iman:'M-20 -16V4A20 20 0 0 0 20 4V-16M-11 -16V4A11 11 0 0 0 11 4V-16M-24 -16H-7M7 -16H24',pincel:'M-29 19Q-10 20 -7 4Q0 -15 27 -18M-22 11L-20 13M11 -10L13 -8',companero:'M-4 0A13 13 0 1 1 -30 0A13 13 0 1 1 -4 0M30 0A13 13 0 1 1 4 0A13 13 0 1 1 30 0M-3 -20Q0 -26 3 -20'}[card.type.split(':')[1]];
 else if(card.type==='anomaly:canon')path='M12 0A20 20 0 1 1 -28 0A20 20 0 1 1 12 0M28 0A20 20 0 1 1 -12 0A20 20 0 1 1 28 0';
 else if(card.type==='anomaly:detenido')path='M24 0A24 24 0 1 1 -24 0A24 24 0 1 1 24 0M-7 -10V10M7 -10V10';
 else if(card.type==='anomaly:frenesi')path='M-30 7H-18L-9 -18L0 21L10 -21L19 7H30';
 else path=card.type==='anomaly:luna'?'M25 0A25 25 0 1 1 -25 0A25 25 0 1 1 25 0M-8 -8L8 8M8 -8L-8 8':card.type==='anomaly:espejo'?'M-19 -21L-1 -12L-1 21L-19 12ZM19 -21L1 -12L1 21L19 12Z':'M0 -24L24 0L0 24L-24 0ZM-14 0H14M0 -14V14';
 return `<svg viewBox="-64 -48 128 96" aria-hidden="true" focusable="false"><path class="rare-orbit" d="M38 0A38 38 0 1 1 -38 0A38 38 0 1 1 38 0"/><path class="rare-glyph" d="${path}"/><path class="rare-sparks" d="M-50 -25h4M-48 -27v4M43 27h4M45 25v4"/></svg>`;
}
