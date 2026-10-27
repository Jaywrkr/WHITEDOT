// Edition flag (L1). 'web' keeps the optional account; 'store' is the sale edition: no account, no cloud and no request
// outside its own files. The source always says 'web'; a packager stamps 'store' into its staged copy with
// scripts/set-edition.mjs (docs/ARQUITECTURA.md). Any other value also turns the cloud off: it fails closed.
export const EDITION='web';
export const EDITIONS=Object.freeze(['web','store']);
export const cloudEnabled=(edition=EDITION)=>edition==='web';
