// Choose nearby octave positions, preserving every pitch class of the actual chord.
export function leadVoicing(notes,previous=[],low=45,high=69){
 const pools=notes.slice(0,3).map(note=>{const out=[];for(let n=low;n<=high;n++)if(((n-note)%12+12)%12===0)out.push(n);return out;});let best=null,bestCost=Infinity;
 for(const a of pools[0]||[])for(const b of pools[1]||[a])for(const c of pools[2]||[b]){const v=[a,b,c].sort((x,y)=>x-y);if(v[2]-v[0]>19)continue;const cost=v.reduce((sum,n,i)=>sum+Math.abs(n-(previous[i]??[50,57,62][i])),0);if(cost<bestCost){bestCost=cost;best=v;}}
 return best||notes.map(n=>{while(n<low)n+=12;while(n>high)n-=12;return n;});
}
