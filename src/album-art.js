import {livingPortrait} from './living-portraits.js';
// Small earned portraits share the world's straight edges and line glyphs.
export function albumPortrait(p){if(p.id.startsWith('living:'))return `<path d="${livingPortrait(p.id)}"/>`;if(p.group!=='cubo')return '<path d="M-22 0L0 -22L22 0L0 22Z"/>';
 const base='<rect x="-13" y="-13" width="26" height="26"/>';if(!p.owned)return base;
 if(p.shape==='color')return `<rect x="-13" y="-13" width="26" height="26" fill="${/^#[a-f0-9]{6}$/i.test(p.value)?p.value:'#fff'}" stroke="none"/>`;
 const marks={wood:'M-10 -7H10M-10 1H10M-10 9H10',grain:'M-8 -8h2M4 -2h2M-4 8h2',glass:'M-7 -7H7V7H-7Z',metal:'M-8 -11V11M5 -11V11',water:'M-10 -3Q0 -11 10 -3M-10 5Q0 -3 10 5',cloth:'M-8 -11V11M0 -11V11M8 -11V11M-11 -8H11M-11 0H11M-11 8H11',star:'M0 -8V8M-8 0H8',double:'M-18 -18H18V18H-18Z',cut:'M-13 -7L-7 -13M7 -13L13 -7M13 7L7 13M-7 13L-13 7',bars:'M-18 -9V9M18 -9V9',corners:'M-19 -12V-19H-12M12 -19H19V-12M19 12V19H12M-12 19H-19V12',beating:'M-19 -19H19V19H-19Z'};
 if(marks[p.value])return base+`<path d="${marks[p.value]}"/>`;if(p.shape==='trail')return base+'<path d="M-19 17L-26 22M-27 25L-33 29"/>';if(p.shape==='halo')return base+'<circle r="23"/>';if(p.shape==='aura')return base+'<path d="M0 -30V-25M25 0H30M0 25V30M-30 0H-25"/>';if(p.shape==='voice')return base+'<path d="M-23 -7V7M23 -7V7M-28 -3V3M28 -3V3"/>';return base;
}
