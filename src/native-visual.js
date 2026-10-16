// Presentation grammar only; original species bits, IDs and placement stay intact.
export function nativeVisualFamily(region,seedOf){
 const id=region.worldFamily?.id;
 if(id==='terraces')return 'pixel';
 return 'anatomy';
}
export function pixelCells(bits){const out=[];for(let row=0;row<5;row++)for(let k=0;k<3;k++)if(bits>>(row*3+k)&1){out.push([k-2,row-2.5]);if(k<2)out.push([2-k,row-2.5]);}return out;}
