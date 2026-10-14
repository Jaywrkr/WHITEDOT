import {RELEASE} from './release-info.js';
import {releaseLabels} from './release-model.js';
export function initialize(runtime){
 const labels=releaseLabels(RELEASE),badge=runtime.$('releaseBadge');
 runtime.$('releaseVersion').textContent=labels.version;
 runtime.$('releaseDeploy').textContent=labels.date;
 badge.title=labels.title;badge.setAttribute('aria-label',labels.version+' · '+labels.date);
 // Static information only: no click handlers, timers or sound calls.
}
