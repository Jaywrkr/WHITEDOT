// Vercel build step: stamp the published revision and the host's build time into the shell.
// Outside Vercel (no commit SHA) it changes nothing, so local and CI runs stay unstamped.
import {stampDeployment} from './stamp-deploy.mjs';
const revision=process.env.VERCEL_GIT_COMMIT_SHA;
if(!revision){console.log('No VERCEL_GIT_COMMIT_SHA: leaving release metadata unstamped.');process.exit(0);}
const deployedAt=new Date().toISOString().replace(/\.\d{3}Z$/,'Z');
console.log(JSON.stringify(stampDeployment({directory:'.',deployedAt,revision}),null,2));
