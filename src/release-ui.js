import {RELEASE} from './release-info.js';
import {releaseLabels} from './release-model.js';
export function initialize(runtime){
 const labels=releaseLabels(RELEASE),badge=runtime.$('releaseBadge');
 runtime.$('releaseVersion').textContent=labels.version;
 runtime.$('releaseDeploy').textContent=labels.date;
 badge.title=labels.title;badge.setAttribute('aria-label',labels.version+' · '+labels.date);
 // Prototype tools stay out of production: only local hosts, ?dev=1 or automated browsers show them.
 const q=new URLSearchParams(location.search);
 document.body.classList.toggle('dev',['localhost','127.0.0.1'].includes(location.hostname)||q.has('dev')||navigator.webdriver===true);
 // Static information only: no click handlers, timers or sound calls.
}
