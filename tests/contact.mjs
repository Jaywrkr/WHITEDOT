import assert from 'node:assert/strict';import {contactEntry} from '../src/contact.js';
const object={};assert(contactEntry(object,true));for(let i=0;i<1000;i++)assert(!contactEntry(object,true));assert(!contactEntry(object,false));assert(contactEntry(object,true));
const paused={};assert(!contactEntry(paused,true,false));assert(contactEntry(paused,true));
const other={};assert(contactEntry(other,true));assert(!contactEntry(object,true));
console.log('PASS: entering creates one contact, holding does not retrigger, leaving rearms independently');
