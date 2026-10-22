// Where a genre plays on the map is chosen from the tempo field of each place (neighborhoods.js, continents.js).
// When a genre's own tempo is retuned to sound more distinct (docs/UNIVERSO.md, phases 8–11), the map keeps its
// original range: every place keeps its genre and its saved tempo, exactly as before. Only the music, when it plays,
// moves that tempo to the same relative point of the new range (soundingBpm). Only retuned genres are listed.
export const PICK_BPM=Object.freeze({
 progressive:[120,128],melodic:[118,124],chicago:[120,126],acidhouse:[120,126],soulful:[120,124],garagehouse:[118,124],
 breaks:[126,134],electro:[124,136],robotic:[124,132],
 cosmic:[100,118],boogie:[104,114],
 dnb:[166,174],liquid:[168,176],boombap:[86,96],gfunk:[88,98]
});
export const pickRange=(id,g)=>PICK_BPM[id]||g.bpm;
// A tempo of the original range, placed at the same point of the genre's playing range.
export function playTempo(id,g,tempo){const [a,b]=pickRange(id,g),t=Math.max(a,Math.min(b,tempo));if(!PICK_BPM[id])return Math.round(t);const k=b>a?(t-a)/(b-a):.5;return Math.round(g.bpm[0]+k*(g.bpm[1]-g.bpm[0]));}
// The tempo a place sounds at, from the tempo it keeps on the map.
export const soundingBpm=(region,genres)=>region&&PICK_BPM[region.genre]&&genres?.[region.genre]?playTempo(region.genre,genres[region.genre],region.bpm):region?.bpm;
