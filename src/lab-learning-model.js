// Optional listening practice. Progress is additive and future versions stay read-only.
export function normalizeLabLearning(raw){
 if(raw&&typeof raw==='object'&&!Array.isArray(raw)&&Number.isInteger(raw.version)&&raw.version>1)return raw;
 const obj=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 return {...obj,version:1,completed:Math.max(0,Math.min(999,Math.trunc(obj.completed)||0)),
  roles:[...new Set(Array.isArray(obj.roles)?obj.roles.filter(r=>['bajo','perc','acorde','lead','agudo'].includes(r)):[])],
  instruments:[...new Set(Array.isArray(obj.instruments)?obj.instruments.filter(id=>typeof id==='string'&&/^[a-z]{1,32}$/.test(id)):[])].slice(-64)};
}
export function responseMatches(times,beat){
 if(times.length<2||!Number.isFinite(beat)||beat<=0)return false;
 const gap=times.at(-1)-times.at(-2);return gap>0&&Math.abs(gap-2*beat)<=beat*.65;
}
