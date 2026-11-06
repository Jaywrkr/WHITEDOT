// Sonido pro (alpha.266, house clásico alpha.267, techno alpha.268, melodic y orgánico and afro y latino alpha.271, the other nine families alpha.276): the production layer only. Each of the 52 genres belongs to one of fourteen sound families;
// a family profile says how its notes and hits sound (kit, bass, synths, space, bus). The composition (tempo, swing,
// patterns, harmony, regions) is not read or changed here. A family without a ready profile keeps the classic sound.
const family=(id,name,genres)=>Object.freeze({id,name,genres:Object.freeze(genres.split(' '))});
export const SOUND_FAMILIES=Object.freeze([
 family('house','House clásico','deep chicago soulful garagehouse acidhouse progressive tropical'),
 family('tech','Tech house y minimal','techhouse minimal rominimal microhouse'),
 family('techno','Techno','dub acid minimaltechno detroit melodictechno'),
 family('melodic','Melodic y orgánico','melodic organic'),
 family('afro','Afro y latino','afro tribal amapiano andean'),
 family('disco','Disco y funk','nudisco cosmic boogie electrofunk'),
 family('uk','UK y breaks','garage breaks brokenbeat'),
 family('bass','Club de bajos','ghetto baltimore jersey miamibass footwork'),
 family('dnb','DnB y dubstep','dnb liquid dubstep'),
 family('hiphop','Hip-hop','boombap lofi trap gfunk'),
 family('electro','Electro','electro robotic detroitelectro ebm'),
 family('ambient','Ambient','ambient downtempo heart berlin'),
 family('jazz','Jazz','jazztronica'),
 family('experimental','Experimental','idm algorave')
]);
const BY_GENRE=new Map(SOUND_FAMILIES.flatMap(f=>f.genres.map(g=>[g,f])));
export const soundFamily=genre=>BY_GENRE.get(genre)||null;

// The classic velocity of each hit in audio.js: a pro hit keeps the composition's dynamics as a ratio of it.
export const CLASSIC_LEVEL=Object.freeze({kick:.26,snare:.09,clap:.06,hat:.022,hatO:.03,rim:.045,shaker:.016,wood:.045,tom:.09,conga:.08,cowbell:.02,blip:.03});
// Math.random draws the classic hit makes; a pro hit draws the same so the composition's stream does not move.
export const CLASSIC_DRAWS=Object.freeze({hat:2,hatO:2,shaker:1,rim:1,clap:1,snare:1,wood:1});

// «Tech house y minimal»: the 08 direction Jay chose («bien marcado»). Dry and percussive, air between the hits.
const TECH=Object.freeze({
 ready:true,
 kit:Object.freeze({kick:Object.freeze({click:.55,decay:.12,drive:2.4,length:.42,hold:.11,tail:.06}),hatTone:1.47,clapRoom:.3,snareUnderClap:.38}),
 // Pro level of each hit at its classic velocity (1 = the kick).
 levels:Object.freeze({kick:.45,snare:.7,clap:.9,hat:1.3,hatO:.9,rim:.6,shaker:.6,wood:.55,tom:.55,conga:.55,cowbell:.3,blip:.4}),
 pan:Object.freeze({hat:.25,hatO:-.2,rim:-.4,shaker:.45,wood:.38,conga:-.3,tom:.25,cowbell:.3,blip:-.3,ghost:-.3}),
 room:Object.freeze({clap:.3,snare:.2,rim:.22,wood:.25,conga:.25,tom:.3,blip:.35}),
 echo:Object.freeze({rim:.12,blip:.3,wood:.08}),
 ghostHats:.22,      // quiet closed hats on the off sixteenths, from the kick: texture, no new accent
 bass:Object.freeze({sub:.6,mid:.9,steps:1,bright:.42}),
 lead:Object.freeze({keep:2,kind:'chop',level:.85,room:.25,echo:.3}),   // every second melody note, as a vocal chop
 chords:Object.freeze({kind:'stab',level:.7,room:.2,echo:.42}),
 space:Object.freeze({seconds:1.8,ret:.4,echoSteps:3,feedback:.33,echoRet:.5}),
 sidechain:Object.freeze({floor:.32,release:.1}),
 glue:Object.freeze({threshold:-16,ratio:2.2,attack:.01,release:.12}),
 drive:1.35,
 output:1,
 phrase:Object.freeze({crash:16,sweep:32})
});
// «House clásico»: warm and round where tech is dry. Full melody, played by the instrument the composition chose
// (organ, Rhodes-like keys, mallets, pads), wide chords in a longer hall, a gentler pump. Each genre keeps its own
// touch on top (GENRE_TOUCH): acid line, raw 909, organ and shuffle, soft deep kick, long builds, airy mallets.
const HOUSE=Object.freeze({
 ready:true,
 kit:Object.freeze({id:'house',kick:Object.freeze({click:.4,decay:.15,drive:2,length:.48,hold:.13,tail:.08}),kickHz:52,hatTone:1.3,clapRoom:.35,snareUnderClap:.3}),
 levels:Object.freeze({kick:.47,snare:.65,clap:.85,hat:1.1,hatO:.85,rim:.6,shaker:.65,wood:.5,tom:.55,conga:.6,cowbell:.35,blip:.4}),
 pan:Object.freeze({hat:.22,hatO:-.18,rim:-.35,shaker:.4,wood:.35,conga:-.32,tom:.25,cowbell:.3,blip:-.3,ghost:-.28}),
 room:Object.freeze({clap:.35,snare:.25,rim:.25,wood:.25,conga:.3,tom:.3,blip:.35,cowbell:.2}),
 echo:Object.freeze({rim:.1,blip:.3,wood:.08,conga:.06}),
 ghostHats:.16,
 bass:Object.freeze({kind:'split',sub:.62,mid:.75,steps:2,bright:.3}),
 // Instrument the composition chose → how it sounds here; anything else takes the style's own kind.
 lead:Object.freeze({keep:1,kind:'ep',level:.8,room:.18,hall:.22,echo:.22,hold:2,map:Object.freeze({organ:'organ',rhodes:'ep',keys:'ep',feltpiano:'ep',saw:'supersaw',strings:'pad',silkstrings:'pad',bowed:'pad',steel:'mallet',kalimba:'mallet',marimba:'mallet',glass:'mallet'})}),
 chords:Object.freeze({kind:'ep',level:.75,room:.15,hall:.35,echo:.15,hold:3,map:Object.freeze({organ:'organ',rhodes:'ep',keys:'ep',feltpiano:'ep',strings:'pad',silkstrings:'pad',bowed:'pad',steel:'mallet',kalimba:'mallet',marimba:'mallet'})}),
 space:Object.freeze({seconds:1.8,ret:.4,echoSteps:3,feedback:.33,echoRet:.5}),
 sidechain:Object.freeze({floor:.4,release:.12}),
 output:.8,
 front:.75,         // the player's voices (sound-pro.js), measured against this family's mix: its pads and keys leave them more room
 syncChords:true,   // notes of the melody's instrument struck together with it are chord notes, not melody
 build:null,
 phrase:Object.freeze({crash:16,sweep:32})
});
// «Techno»: weight under the floor. A kick with its rumble (the kick's own tail, low-passed, driven and pumped), the bass in
// sub and mid under a deeper sidechain, wide pads and stabs into the hall, the room and a dark tape echo. Each genre
// keeps its own touch (GENRE_TOUCH): dub stabs into the tape, the hard 303, dry minimal clicks, Detroit strings, big arps.
const TECHNO=Object.freeze({
 ready:true,
 kit:Object.freeze({id:'techno',kick:Object.freeze({click:.6,decay:.14,drive:3,length:.46,hold:.12,tail:.07}),kickHz:48,hatTone:1.5,clapRoom:.4,snareUnderClap:.35}),
 rumble:Object.freeze({level:.32,drive:3,q:6}),   // the rumble under each kick, ducked by the next one
 levels:Object.freeze({kick:.5,snare:.65,clap:.85,hat:1.2,hatO:.9,rim:.6,shaker:.6,wood:.5,tom:.6,conga:.5,cowbell:.3,blip:.45}),
 pan:Object.freeze({hat:.25,hatO:-.2,rim:-.4,shaker:.45,wood:.38,conga:-.3,tom:.3,cowbell:.3,blip:-.35,ghost:-.3}),
 room:Object.freeze({clap:.4,snare:.3,rim:.3,wood:.25,conga:.25,tom:.35,blip:.4}),
 echo:Object.freeze({rim:.15,blip:.35,wood:.1,tom:.1}),
 ghostHats:.14,
 bass:Object.freeze({kind:'split',sub:.72,mid:.7,steps:1,bright:.3}),
 lead:Object.freeze({keep:1,kind:'stab',level:.8,room:.18,hall:.3,echo:.3,tape:0,width:1,hold:2,map:Object.freeze({saw:'supersaw',strings:'strings',silkstrings:'strings',bowed:'strings',organ:'organ',keys:'ep',rhodes:'ep',feltpiano:'ep',glass:'mallet',steel:'mallet',marimba:'mallet',phasekeys:'ep',tinepiano:'ep',p_tinepiano:'ep',clav:'stab',feltmallet:'mallet',p_feltmallet:'mallet',fmharp:'mallet',p_fmharp:'mallet',reed:'strings',cellobody:'strings',p_cellobody:'strings',gutguitar:'stab',p_gutguitar:'stab',barkkeys:'stab',p_barkkeys:'stab'})}),
 chords:Object.freeze({kind:'pad',level:1.1,room:.1,hall:.45,echo:.18,tape:0,width:1.2,hold:4,map:Object.freeze({strings:'strings',silkstrings:'strings',bowed:'strings',rhodes:'ep',keys:'ep',feltpiano:'ep',organ:'organ',stab:'stab',phasekeys:'ep',tinepiano:'ep',p_tinepiano:'ep',clav:'stab',feltmallet:'mallet',p_feltmallet:'mallet',fmharp:'mallet',p_fmharp:'mallet',reed:'strings',cellobody:'strings',p_cellobody:'strings',gutguitar:'stab',p_gutguitar:'stab',barkkeys:'stab',p_barkkeys:'stab'})}),
 space:Object.freeze({seconds:1.8,ret:.4,echoSteps:3,feedback:.33,echoRet:.5}),
 sidechain:Object.freeze({floor:.28,release:.13}),
 output:.85,
 front:.6,          // the player's voices: bright arps and stabs carry, so they sit lower
 syncChords:true,
 build:null,
 phrase:Object.freeze({crash:16,sweep:32})
});
// «Melodic y orgánico»: warm and deep, Anjunadeep and Keinemusik. A soft round kick, plucks into a long dotted echo,
// warm wide pads in the hall, hand drums and shakers up front, a gentle pump. Each genre keeps its touch (GENRE_TOUCH).
const MELODIC=Object.freeze({
 ready:true,
 kit:Object.freeze({id:'melodic',kick:Object.freeze({click:.22,decay:.17,drive:1.6,length:.5,hold:.13,tail:.09}),kickHz:50,hatTone:1.36,clapRoom:.42,snareUnderClap:.28,tomDecay:.2,congaDecay:.1}),
 levels:Object.freeze({kick:.44,snare:.6,clap:.75,hat:1,hatO:.8,rim:.55,shaker:.95,wood:.6,tom:.75,conga:.75,cowbell:.3,blip:.4}),
 pan:Object.freeze({hat:.22,hatO:-.18,rim:-.35,shaker:.42,wood:.38,conga:-.34,tom:.22,cowbell:.3,blip:-.3,ghost:-.28}),
 room:Object.freeze({clap:.42,snare:.3,rim:.3,wood:.3,conga:.3,tom:.4,blip:.4,cowbell:.2}),
 echo:Object.freeze({rim:.14,blip:.35,wood:.12,conga:.08,tom:.12}),
 ghostHats:.12,
 bass:Object.freeze({kind:'split',sub:.64,mid:.6,steps:2,bright:.2}),
 lead:Object.freeze({keep:1,kind:'pluck',level:.85,room:.12,hall:.3,echo:.48,width:1.3,hold:2,map:Object.freeze({rhodes:'ep',keys:'ep',feltpiano:'ep',p_tinepiano:'ep',tinepiano:'ep',phasekeys:'pluck',saw:'pluck',strings:'pad',silkstrings:'pad',bowed:'pad',lowbow:'pad',cellobody:'pad',p_cellobody:'pad',kalimba:'mallet',marimba:'mallet',steel:'mallet',glass:'mallet',feltmallet:'mallet',p_feltmallet:'mallet',flute:'flute',airflute:'flute',reed:'flute',p_panreed:'flute',gutguitar:'string',p_gutguitar:'string',organ:'pad',resonantpluck:'pluck'})}),
 chords:Object.freeze({kind:'pad',level:1.35,room:.08,hall:.5,echo:.16,width:1.6,hold:8,map:Object.freeze({rhodes:'ep',keys:'ep',feltpiano:'ep',p_tinepiano:'ep',tinepiano:'ep',kalimba:'mallet',marimba:'mallet',steel:'mallet',feltmallet:'mallet',p_feltmallet:'mallet',gutguitar:'string',p_gutguitar:'string',phasekeys:'pluck',resonantpluck:'pluck'})}),
 space:Object.freeze({seconds:1.8,ret:.4,echoSteps:3,feedback:.33,echoRet:.5}),
 sidechain:Object.freeze({floor:.42,release:.15}),
 output:1,
 front:.7,          // the player's voices against this mix: long pads and echoes leave a little less room than house
 answer:Object.freeze({id:'conga',mult:4}),   // the groove layer's answer to the player: a hand drum
 syncChords:true,
 build:null,
 phrase:Object.freeze({crash:16,sweep:32})
});
// «Afro y latino»: the drums in front. Hand drums, shakers and toms with body and room, a rounder kick, warm keys and
// pads under marimba, flute and string plucks. Each genre keeps its touch: afro's marimba and percussion, amapiano's log
// drum and piano, tribal toms and chant-like formant hits (no recorded voice), the Andean pan flute, charango and bombo.
const AFRO=Object.freeze({
 ready:true,
 kit:Object.freeze({id:'afro',kick:Object.freeze({click:.35,decay:.15,drive:2,length:.46,hold:.12,tail:.08}),kickHz:50,hatTone:1.4,clapRoom:.32,snareUnderClap:.3,tomDecay:.18,congaDecay:.11}),
 levels:Object.freeze({kick:.46,snare:.62,clap:.8,hat:1.05,hatO:.85,rim:.65,shaker:1.05,wood:.75,tom:.8,conga:.85,cowbell:.4,blip:.4}),
 pan:Object.freeze({hat:.22,hatO:-.2,rim:-.38,shaker:.45,wood:.4,conga:-.36,tom:.28,cowbell:.32,blip:-.3,ghost:-.28}),
 room:Object.freeze({clap:.32,snare:.25,rim:.25,wood:.28,conga:.3,tom:.38,blip:.35,cowbell:.2}),
 echo:Object.freeze({rim:.1,blip:.3,wood:.1,conga:.06,tom:.06}),
 ghostHats:.16,
 bass:Object.freeze({kind:'split',sub:.66,mid:.66,steps:2,bright:.24}),
 lead:Object.freeze({keep:1,kind:'mallet',level:.85,room:.18,hall:.25,echo:.3,width:1.2,hold:2,map:Object.freeze({rhodes:'ep',keys:'ep',feltpiano:'ep',p_tinepiano:'ep',tinepiano:'ep',organ:'organ',strings:'pad',silkstrings:'pad',bowed:'pad',cellobody:'pad',p_cellobody:'pad',flute:'flute',airflute:'flute',reed:'flute',p_panreed:'flute',gutguitar:'string',p_gutguitar:'string',saw:'pluck',phasekeys:'pluck',resonantpluck:'pluck',membrane:'mallet'})}),
 chords:Object.freeze({kind:'pad',level:1.2,room:.1,hall:.42,echo:.14,width:1.4,hold:6,map:Object.freeze({rhodes:'ep',keys:'ep',feltpiano:'ep',p_tinepiano:'ep',tinepiano:'ep',organ:'organ',kalimba:'mallet',marimba:'mallet',steel:'mallet',gutguitar:'string',p_gutguitar:'string',resonantpluck:'pluck'})}),
 space:Object.freeze({seconds:1.8,ret:.4,echoSteps:3,feedback:.33,echoRet:.5}),
 sidechain:Object.freeze({floor:.45,release:.13}),
 output:1,
 front:.7,
 answer:Object.freeze({id:'conga',mult:4}),
 syncChords:true,
 build:null,
 phrase:Object.freeze({crash:16,sweep:32})
});
// Alpha.272: the nine remaining families. Shared instrument maps (the composition's instrument → the engine's kind);
// each family overrides what it needs. The beat layer (beats) hangs ghosts and the answer on each beat, not on the kick.
const KEYS=Object.freeze({rhodes:'ep',keys:'ep',feltpiano:'ep',tinepiano:'ep',p_tinepiano:'ep',p_tapepiano:'ep',p_ebonypiano:'ep',phasekeys:'ep',organ:'organ',p_fogorgan:'organ',
 strings:'strings',silkstrings:'strings',bowed:'strings',lowbow:'strings',cellobody:'strings',p_cellobody:'strings',p_violaswell:'strings',p_stringcloud:'pad',p_velvetchoir:'pad',p_breathingpad:'pad',choir:'pad',wavetable:'pad',
 clav:'clav',p_barkkeys:'clav',barkkeys:'clav',brass:'brass',p_softhorn:'brass',vocalform:'chop',metalkeys:'bell',p_roundbell:'bell',p_celestabody:'bell',roundbell:'bell',glass:'bell',p_fmharp:'bell',fmharp:'bell',
 kalimba:'mallet',marimba:'mallet',steel:'mallet',feltmallet:'mallet',p_feltmallet:'mallet',flute:'flute',airflute:'flute',p_panreed:'flute',reed:'sax',p_bassclarinet:'sax',gutguitar:'string',p_gutguitar:'string',saw:'supersaw',pluck:'pluck',resonantpluck:'pluck'});
const lead=(kind,o={},map={})=>Object.freeze({keep:1,kind,level:.85,room:.15,hall:.25,echo:.25,width:1.2,hold:2,...o,map:Object.freeze({...KEYS,...map})});
const kit=(id,kick,o={})=>Object.freeze({id,kick:Object.freeze(kick),kickHz:50,hatTone:1.45,clapRoom:.32,snareUnderClap:.3,...o});
const LEVELS=Object.freeze({kick:.46,snare:.65,clap:.85,hat:1.1,hatO:.9,rim:.6,shaker:.7,wood:.55,tom:.6,conga:.6,cowbell:.35,blip:.4});
const PAN=Object.freeze({hat:.24,hatO:-.2,rim:-.36,shaker:.42,wood:.36,conga:-.32,tom:.26,cowbell:.3,blip:-.3,ghost:-.28});
const ROOM=Object.freeze({clap:.32,snare:.25,rim:.25,wood:.25,conga:.28,tom:.3,blip:.35,cowbell:.2});
const ECHO=Object.freeze({rim:.1,blip:.3,wood:.08,conga:.06});
const SPACE=Object.freeze({seconds:1.8,ret:.4,echoSteps:3,feedback:.33,echoRet:.5}),PHRASE=Object.freeze({crash:16,sweep:32});
const base=o=>Object.freeze({ready:true,levels:LEVELS,pan:PAN,room:ROOM,echo:ECHO,space:SPACE,phrase:PHRASE,build:null,syncChords:true,output:1,front:.7,beats:true,ghostHats:.14,...o});
// «Disco y funk»: four on the floor or the funk's own kick, a slap-like synth bass, disco strings through a phaser,
// brass-like stabs, clavinet and Rhodes, open hats on the off-beats, chords in a filtered loop, talkbox-like formant
// leads (no recorded voice) and warm analog glue on the deck.
const DISCO=base({
 kit:kit('disco',{click:.45,decay:.14,drive:2.2,length:.44,hold:.12,tail:.07},{kickHz:52,hatTone:1.42,clapRoom:.36}),
 levels:{...LEVELS,hatO:1.15,clap:.9,shaker:.8,cowbell:.4},room:{...ROOM,clap:.36},
 bass:Object.freeze({kind:'slap',sub:.6,mid:.95,steps:2,bright:.5,pop:.35,q:5}),
 lead:lead('clav',{level:.85,hall:.22,echo:.24},{vocalform:'talkbox',saw:'talkbox'}),
 chords:lead('strings',{level:1.2,room:.12,hall:.4,echo:.12,phase:.55,width:1.5,hold:4},{brass:'brass',p_softhorn:'brass',clav:'clav',organ:'organ',vocalform:'talkbox'}),
 loop:Object.freeze({bars:8,low:.45}),warm:1.8,ghostHats:.12,
 sidechain:Object.freeze({floor:.42,release:.13}),front:.7,answer:Object.freeze({id:'conga',mult:4})
});
// «UK y breaks»: synthesized breakbeats (a layered snare, ghost snares and hats with the composition's swing), the 2-step
// shuffle with organ and chord stabs over a sub, broken beat's jazzy keys; reese bass for breaks.
const UK=base({
 kit:kit('uk',{click:.65,decay:.12,drive:2.8,length:.4,hold:.1,tail:.06},{kickHz:54,hatTone:1.55,clapRoom:.28,snareClap:.35,snare:Object.freeze({body:200,noise:1.1,tail:.07,drive:2.2})}),
 levels:{...LEVELS,snare:.75,hat:1.2,hatO:.95,rim:.7},room:{...ROOM,snare:.3},
 bass:Object.freeze({kind:'split',sub:.85,mid:.45,steps:2,bright:.25}),
 lead:lead('ep',{level:.85,hall:.25,echo:.28},{saw:'stab',glass:'bell'}),
 chords:lead('organ',{level:1,room:.15,hall:.3,echo:.18,hold:1.5},{keys:'organ',rhodes:'ep'}),
 ghostHats:.2,ghostSnare:Object.freeze({level:.22,steps:[2,7,9,15],p:.55}),
 sidechain:Object.freeze({floor:.45,release:.11}),front:.75,answer:Object.freeze({id:'snare',mult:1})
});
// «Club de bajos»: hard and bright. 808 booms, bright claps, chopped synthetic vocal stabs (formants, no recorded
// voice), the triplet and Jersey kick patterns as composed.
const BASS=base({
 kit:kit('club',{click:.7,decay:.16,drive:3,length:.5,hold:.12,tail:.08},{kickHz:50,hatTone:1.55,clapRoom:.25,snareUnderClap:.4}),
 levels:{...LEVELS,clap:1.05,hat:1.15,snare:.7},
 bass:Object.freeze({kind:'boom',sub:.85,mid:.5,steps:2,bright:.4,decay:.32,drive:2.2,glide:0}),
 lead:lead('chop',{level:1,room:.18,hall:.12,echo:.3,hold:1},{vocalform:'chop',brass:'brass',saw:'stab'}),
 chords:lead('stab',{level:.9,cut:3200,room:.15,hall:.15,echo:.2,hold:1},{brass:'brass',vocalform:'chop'}),
 sidechain:Object.freeze({floor:.4,release:.1}),front:.7,answer:Object.freeze({id:'clap',mult:1})
});
// «DnB y dubstep»: layered fast breaks, reese and sub, liquid pads and Rhodes, the dubstep wobble (an LFO on the
// bass filter, in time) under half-time drums as composed.
const DNB=base({
 kit:kit('dnb',{click:.7,decay:.1,drive:2.6,length:.34,hold:.08,tail:.05},{kickHz:55,hatTone:1.6,clapRoom:.3,snareClap:.3,snare:Object.freeze({body:210,noise:1.15,tail:.08,drive:2.4})}),
 levels:{...LEVELS,snare:.8,hat:.7,shaker:.5},room:{...ROOM,snare:.32},
 bass:Object.freeze({kind:'reese',sub:.8,mid:.7,steps:4,bright:.3,detune:16,drive:2}),
 lead:lead('ep',{level:.85,hall:.35,echo:.3},{organ:'pad',saw:'supersaw'}),
 chords:lead('pad',{level:1.2,room:.08,hall:.5,echo:.15,width:1.5,hold:6},{rhodes:'ep',keys:'ep',organ:'pad'}),
 ghostHats:.12,ghostSnare:Object.freeze({level:.18,steps:[2,6,10,14],p:.4}),
 sidechain:Object.freeze({floor:.45,release:.1}),front:.72,answer:Object.freeze({id:'snare',mult:1})
});
// «Hip-hop»: dusty drums with the composition's swing, warm glue, round bass; lo-fi adds vinyl and a tape wobble,
// trap the 808 glide and rolling hats, G-funk a whining lead with portamento and a funky bass.
const HIPHOP=base({
 kit:kit('hiphop',{click:.4,decay:.17,drive:2.4,length:.5,hold:.13,tail:.08},{kickHz:50,hatTone:1.35,clapRoom:.3,snare:Object.freeze({body:180,noise:.8,tail:.09,drive:2.6})}),
 levels:{...LEVELS,snare:.8,kick:.5,hat:1},room:{...ROOM,snare:.3,rim:.3},
 bass:Object.freeze({kind:'split',sub:.75,mid:.55,steps:3,bright:.2}),
 lead:lead('ep',{level:.85,hall:.25,echo:.22,hold:3},{saw:'whine'}),
 chords:lead('ep',{level:1,room:.15,hall:.35,echo:.12,hold:4},{strings:'strings'}),
 warm:2,ghostHats:.1,
 sidechain:Object.freeze({floor:.55,release:.14}),front:.72,answer:Object.freeze({id:'rim',mult:1})
});
// «Electro»: the 808 machine. A long 808 kick, bright claps and cowbell, robotic vocoder-like formant hits (no recorded
// voice), sequenced machine bass; EBM's dark gated snare.
const ELECTRO=base({
 kit:kit('electro',{click:.5,decay:.22,drive:2.2,length:.6,hold:.14,tail:.12},{kickHz:48,hatTone:1.6,clapRoom:.3,snareUnderClap:.4,snare:Object.freeze({body:200,noise:1,tail:.07,drive:2})}),
 levels:{...LEVELS,clap:.95,hat:1.2,cowbell:.5,rim:.7},
 bass:Object.freeze({kind:'split',sub:.7,mid:.85,steps:1,bright:.5}),
 lead:lead('vocoder',{level:.9,room:.15,hall:.2,echo:.3,hold:1},{vocalform:'vocoder',saw:'stab',keys:'bell',strings:'strings'}),
 chords:lead('stab',{level:.9,cut:3000,room:.1,hall:.3,echo:.22,hold:2},{strings:'strings',organ:'organ',vocalform:'vocoder'}),
 ghostHats:.1,
 sidechain:Object.freeze({floor:.4,release:.11}),front:.68,answer:Object.freeze({id:'cowbell',mult:1})
});
// «Ambient»: long evolving pads in the hall, granular-like clouds (synthesized), Berlin School sequences, soft kicks
// where composed, heart's deep dub echoes. Quieter on purpose (about -14 LUFS).
const AMBIENT=base({
 kit:kit('ambient',{click:.12,decay:.2,drive:1.4,length:.55,hold:.14,tail:.1},{kickHz:46,hatTone:1.3,clapRoom:.5,tomDecay:.2,congaDecay:.1}),
 levels:{...LEVELS,kick:.4,hat:.8,shaker:.8},room:{...ROOM,clap:.5,snare:.45,rim:.4,wood:.4,tom:.45},echo:{...ECHO,rim:.2,wood:.2,blip:.4},
 bass:Object.freeze({kind:'split',sub:.6,mid:.3,steps:4,bright:.12}),
 lead:lead('grain',{level:.9,room:.15,hall:.5,echo:.35,width:1.6,hold:4},{glass:'bell',flute:'flute'}),
 chords:lead('pad',{level:1.4,room:.05,hall:.6,echo:.12,width:1.8,hold:12},{glass:'grain',flute:'pad',stab:'stab'}),
 build:Object.freeze({bars:32,low:700,high:6000}),ghostHats:0,
 sidechain:Object.freeze({floor:.8,release:.2}),front:.8,answer:Object.freeze({id:'wood',mult:1})
});
// «Jazz»: brushes and ride, an upright-like bass (a dark plucked string), Rhodes and a sax-like formant lead.
const JAZZ=base({
 kit:kit('jazz',{click:.22,decay:.16,drive:1.6,length:.46,hold:.12,tail:.08},{kickHz:52,hatTone:1.3,clapRoom:.4,ride:1.1,brush:true}),
 levels:{...LEVELS,snare:.9,kick:.42,hat:1.1,rim:.7,shaker:.7},room:{...ROOM,snare:.3,rim:.3},
 bass:Object.freeze({kind:'upright',sub:.6,mid:.9,steps:2,bright:.1}),
 lead:lead('sax',{level:.9,room:.2,hall:.3,echo:.18,hold:3},{rhodes:'ep',clav:'clav'}),
 chords:lead('ep',{level:1.1,room:.15,hall:.35,echo:.1,hold:4},{clav:'clav'}),
 warm:1.6,ghostHats:.08,ghostSnare:Object.freeze({level:.25,steps:[3,7,11,14],p:.45}),
 sidechain:Object.freeze({floor:.7,release:.15}),front:.75,answer:Object.freeze({id:'rim',mult:1})
});
// «Experimental»: precise glitchy drums with stutters, FM bells, granular stutter clouds, patterns as composed.
const EXPERIMENTAL=base({
 kit:kit('glitch',{click:.8,decay:.09,drive:2.6,length:.3,hold:.07,tail:.04},{kickHz:52,hatTone:1.7,clapRoom:.2,snare:Object.freeze({body:240,noise:1.2,tail:.04,drive:2.8,gate:.09})}),
 levels:{...LEVELS,rim:.8,wood:.75,blip:.6,hat:1.2},echo:{...ECHO,rim:.2,blip:.4,wood:.15},
 bass:Object.freeze({kind:'split',sub:.7,mid:.75,steps:1,bright:.55}),
 lead:lead('bell',{level:.9,room:.15,hall:.3,echo:.35,hold:2},{kalimba:'bell',metalkeys:'bell',clav:'clav'}),
 chords:lead('grain',{level:1,room:.1,hall:.4,echo:.2,hold:3},{clav:'clav',metalkeys:'bell'}),
 stutter:Object.freeze({p:.16}),ghostHats:.12,
 sidechain:Object.freeze({floor:.45,release:.1}),front:.7,answer:Object.freeze({id:'rim',mult:1})
});
// Per-genre touches inside each family (one level deep over its profile). The composition (tempo, swing, patterns) is not here.
const GENRE_TOUCH=Object.freeze({
 // Disco y funk. Nu-disco: punchy four on the floor, the slap bass, phased strings and brass stabs, clav and talkbox.
 nudisco:{kit:{id:'nudisco'},output:0.85},
 // Cosmic disco: slower and spacier, strings deep in the phaser and the hall, a longer echo, a round bass.
 cosmic:{kit:{id:'cosmic',kick:{click:.32,decay:.16,drive:1.9,length:.48,hold:.13,tail:.08},kickHz:50},bass:{pop:.15,bright:.35,sub:.7},chords:{phase:.8,hall:.55,level:1.3,hold:6},lead:{echo:.42,hall:.35},loop:{bars:16,low:.35},output:0.76},
 // Boogie: post-disco. A brighter slap with more pop, clav and brass up front, a punchy kick.
 boogie:{kit:{id:'boogie',kick:{click:.55,decay:.13,drive:2.6,length:.42,hold:.11,tail:.06},kickHz:56},bass:{pop:.55,bright:.62,mid:1.05},chords:{kind:'brass',level:1.1,phase:.3},output:0.84},
 // Electro-funk: machine funk. A long 808-like kick, a synth bass without the pop, the talkbox lead, cowbell.
 electrofunk:{kit:{id:'electrofunk',kick:{click:.4,decay:.24,drive:2.2,length:.62,hold:.14,tail:.12},kickHz:48},levels:{cowbell:.5,rim:.7},bass:{pop:0,bright:.6,q:8,steps:1},lead:{kind:'talkbox',level:1},chords:{kind:'stab',cut:3000,phase:.2},warm:1.4,output:1.01},
 // UK y breaks. Breaks: the layered break, ghost snares, a reese bass and saw stabs.
 breaks:{kit:{id:'breaks'},levels:{hat:.75,hatO:.7},bass:{kind:'reese',sub:.75,mid:.75,steps:2,bright:.35,detune:16,drive:2},chords:{kind:'stab',cut:3200,hold:1},lead:{kind:'stab',cut:3400,map:{saw:'supersaw',organ:'organ'}},output:0.44},
 // UK garage: the 2-step shuffle in the ghost hats, organ stabs, a deep sub.
 garage:{kit:{id:'garage2step',kick:{click:.55,decay:.12,drive:2.4,length:.4,hold:.1,tail:.06},snareClap:.5},ghostHats:.32,ghostSnare:{level:.15,p:.35},bass:{sub:.95,mid:.35,bright:.2},output:0.48},
 // Broken beat: jazzy Rhodes in the hall, a softer slap, rim and shaker in the cracks.
 brokenbeat:{kit:{id:'brokenbeat',kick:{click:.4,decay:.14,drive:2,length:.44,hold:.12,tail:.07},snareClap:.15},bass:{kind:'slap',sub:.6,mid:.85,steps:2,bright:.35,pop:.2,q:4},chords:{kind:'ep',level:1.1,hall:.4,hold:4},lead:{map:{clav:'clav'}},warm:1.5,output:0.66},
 // Club de bajos. Ghetto house: hard kicks, fast claps, chopped vocal stabs, the machine bass.
 ghetto:{kit:{id:'ghetto'},bass:{kind:'split',sub:.8,mid:.8,steps:1,bright:.5},output:0.82},
 // Footwork: the triplet kicks as composed, a long 808 boom, toms, chopped vocals.
 footwork:{kit:{id:'footwork',kick:{click:.6,decay:.2,drive:2.6,length:.55,hold:.12,tail:.1},kickHz:44},bass:{decay:.45,glide:.25},output:0.61},
 // Baltimore club: the doubled kicks, bright claps and brass-like stabs.
 baltimore:{kit:{id:'baltimore'},lead:{map:{brass:'brass'}},output:0.82},
 // Jersey club: the bouncing five-kick bursts, bright claps, vocal chops.
 jersey:{kit:{id:'jersey',kick:{click:.75,decay:.14,drive:3,length:.42,hold:.1,tail:.07},kickHz:52},output:0.65},
 // Miami bass: the longest 808 kick and boom, fast hats, cowbell.
 miamibass:{kit:{id:'miamibass',kick:{click:.45,decay:.35,drive:2.4,length:.9,hold:.16,tail:.2},kickHz:42},bass:{decay:.45,glide:.15,sub:.9},levels:{cowbell:.5},output:0.7},
 // DnB y dubstep. Drum & bass: the fast layered break and the reese.
 dnb:{kit:{id:'dnbkit'},levels:{hat:.55,shaker:.4},output:0.32},
 // Liquid: softer drums, the sub under Rhodes and wide pads.
 liquid:{kit:{id:'liquid',kick:{click:.45,decay:.12,drive:2,length:.38,hold:.09,tail:.06},snareClap:.15},bass:{kind:'split',sub:.85,mid:.35,steps:4,bright:.15,map:{reese:'reese'}},chords:{level:1.4,hall:.55},output:0.4},
 // Dubstep: half-time drums as composed, a heavy kick, the wobble bass.
 dubstep:{kit:{id:'dubstep',kick:{click:.75,decay:.2,drive:3,length:.55,hold:.13,tail:.1},kickHz:46,snareClap:.45},bass:{kind:'wobble',sub:.85,mid:.9,steps:4,bright:.35,drive:2.6},lead:{map:{organ:'stab',saw:'supersaw'}},output:0.35},
 // Hip-hop. Boom bap: a dusty kick and a fat snare, Rhodes, a round bass.
 boombap:{kit:{id:'boombap'},output:0.75},
 // Lo-fi: a soft kick, vinyl under it and a tape wobble on the keys.
 lofi:{kit:{id:'lofi',kick:{click:.2,decay:.18,drive:1.8,length:.5,hold:.13,tail:.08},snare:{body:175,noise:.6,tail:.08,drive:2}},vinyl:.04,lead:{wobble:14,map:{kalimba:'mallet'}},chords:{wobble:14,hall:.4},sidechain:{floor:.65},output:0.55},
 // Trap: an 808 that glides, a hard clap, rolling hats as composed.
 trap:{kit:{id:'trap',kick:{click:.55,decay:.3,drive:2.6,length:.8,hold:.16,tail:.18},kickHz:42,snareUnderClap:.5},bass:{kind:'boom',sub:.9,mid:.4,steps:4,bright:.3,decay:.55,drive:2.4,glide:.45},lead:{kind:'bell'},chords:{kind:'strings'},levels:{clap:1,hat:1.2},output:0.63},
 // G-funk: the whining lead with portamento and the funky slap bass, a laid-back kick.
 gfunk:{kit:{id:'gfunk'},bass:{kind:'slap',sub:.65,mid:.9,steps:2,bright:.4,pop:.25,q:5},lead:{kind:'whine',map:{saw:'whine'}},output:0.74},
 // Electro. Electro: the 808 machine with clap and cowbell, robotic stabs.
 electro:{kit:{id:'electro808'},output:0.68},
 // Electro robótico: slow and exact, vocoder-like hits, the timbale's tom bright.
 robotic:{kit:{id:'robotic',kick:{click:.45,decay:.18,drive:2,length:.52,hold:.13,tail:.1}},output:0.82},
 // Electro de Detroit: fast and aquatic, strings and cold FM bells.
 detroitelectro:{kit:{id:'detroitelectro'},lead:{kind:'bell',map:{metalkeys:'bell',strings:'strings'}},chords:{kind:'strings',hall:.45},output:0.61},
 // Darkwave / EBM: a dark sequenced bass, a gated snare, vocoder-like hits.
 ebm:{kit:{id:'ebm',kick:{click:.7,decay:.12,drive:3,length:.4,hold:.1,tail:.06},snare:{body:190,noise:1.2,tail:.18,drive:2.6,gate:.13}},bass:{bright:.65,mid:1},room:{snare:.5},output:0.88},
 // Ambient: almost no drums, grains and pads in the hall.
 ambient:{kit:{id:'ambientkit'},output:0.82},
 // Downtempo: a soft kick, keys and flute, pads.
 downtempo:{kit:{id:'downtempo'},lead:{kind:'ep',map:{flute:'flute',keys:'ep'}},output:0.6},
 // Dub profundo (heart): the deep kick, dub chord stabs into the tape echo and the hall, a deep sub.
 heart:{kit:{id:'heart',kick:{click:.18,decay:.25,drive:1.8,length:.7,hold:.16,tail:.14},kickHz:44},bass:{sub:.9,mid:.2},chords:{map:{stab:'stab'},tape:.6},lead:{kind:'flute',tape:.4,hall:.5},output:0.5},
 // Berlin School: sequenced arps (resonant plucks into the echo), long pads that open over the phrase.
 berlin:{kit:{id:'berlin'},lead:{kind:'pluck',echo:.45,map:{organ:'pluck',strings:'pad'}},chords:{kind:'pad'},bass:{kind:'split',bright:.45,steps:1,mid:.6},output:0.34},
 // Jazztronica: brushes and ride, the upright-like bass, Rhodes and the sax-like lead.
 jazztronica:{kit:{id:'jazztronica'},output:0.59},
 // IDM: glitchy stutters, FM bells, grains.
 idm:{kit:{id:'idm'},output:0.62},
 // Algorave: live-coded patterns as composed, bright and precise, stutters, bells and clav.
 algorave:{kit:{id:'algorave',kick:{click:.85,decay:.1,drive:3,length:.34,hold:.08,tail:.05}},stutter:{p:.22},output:0.92},
 // Warm pads, a softer and rounder kick, the side-stick and hats pulled back.
 deep:{kit:{id:'deep',kick:{click:.2,decay:.2,drive:1.5,length:.55,hold:.15,tail:.1},kickHz:50,hatTone:1.3},levels:{kick:.4,hat:1.25,rim:.6,shaker:.9},ghostHats:.3,
  bass:{bright:.2,mid:.7,sub:.46},chords:{kind:'pad',level:1.4,hall:.5,hold:6,map:{organ:'pad',rhodes:'pad',keys:'pad'}},lead:{level:.75,hall:.3},sidechain:{floor:.48,release:.16}},
 // Raw 909: a harder click and drive, bright hats, a dry clap and bright piano-like stabs.
 chicago:{kit:{id:'chicago',kick:{click:.75,decay:.13,drive:3,length:.44,hold:.11,tail:.06},kickHz:54,hatTone:1.55,clapRoom:.18,snareUnderClap:.45},levels:{kick:.48,hat:1.35,hatO:1,clap:.95,conga:.65},
  ghostHats:.12,chords:{kind:'stab',level:.85,cut:3800,hall:.15,map:null},lead:{map:{organ:'organ'}},sidechain:{floor:.36,release:.1}},
 // Church organ and Rhodes, shuffled ghost hats, warm room.
 soulful:{kit:{id:'soulful',kick:{click:.35,decay:.16,drive:1.9,length:.5,hold:.13,tail:.08},kickHz:50},levels:{shaker:1},ghostHats:.35,chords:{kind:'organ',level:.85,hall:.4},lead:{level:.8},bass:{bright:.25}},
 // Paradise Garage: organ chords that float, a strong shuffle in the ghost hats, the organ bass kept round.
 garagehouse:{kit:{id:'garage',hatTone:1.4},ghostHats:.4,chords:{kind:'organ',level:1.1,hall:.45,hold:4},bass:{bright:.22,mid:.85}},
 // A resonant, sliding acid line on the bass voice, its filter breathing over sixteen bars.
 acidhouse:{kit:{id:'acid',kick:{click:.6,decay:.13,drive:2.6,length:.44,hold:.11,tail:.06},kickHz:54,hatTone:1.5},levels:{hatO:.9,cowbell:.4},ghostHats:.1,
  bass:{kind:'acid',sub:.35,mid:1,steps:1,bright:.5,q:15,low:280,high:2600,cycle:16,slide:.3,accent:.35,drive:2.4},sidechain:{floor:.42,release:.1}},
 // Long filter builds over each 32-bar phrase on pads and leads; a tight kick, more pump.
 progressive:{kit:{id:'progressive',kick:{click:.45,decay:.13,drive:2.2,length:.46,hold:.12,tail:.07},kickHz:50,hatTone:1.4},levels:{hat:1.35,hatO:.95},ghostHats:.12,
  chords:{kind:'pad',level:1.3,hall:.5,hold:12,map:{organ:'pad',rhodes:'pad',keys:'pad'}},lead:{map:{saw:'supersaw',keys:'supersaw',organ:'organ'},echo:.32},build:{bars:32,low:500,high:14000},sidechain:{floor:.3,release:.14}},
 // Airy: mallet plucks, a soft kick, more hall and echo, light hats.
 tropical:{kit:{id:'tropical',kick:{click:.25,decay:.17,drive:1.6,length:.5,hold:.13,tail:.09},kickHz:50,hatTone:1.35},levels:{kick:.42,hat:1.1,shaker:1.3,conga:.7},room:{conga:.35},echo:{conga:.1},ghostHats:.2,
  bass:{bright:.22,sub:.55,mid:.6},lead:{kind:'mallet',level:.85,hall:.35,echo:.32,map:{steel:'mallet',kalimba:'mallet'}},chords:{kind:'mallet',hall:.45},sidechain:{floor:.45,release:.15}},
 // Techno. Dub: chord stabs into the long tape echo and a hazy hall, a deep sub, a soft round kick and its rumble.
 dub:{kit:{id:'dub',kick:{click:.3,decay:.18,drive:2,length:.55,hold:.14,tail:.1},kickHz:46,hatTone:1.4},rumble:{level:.38,drive:2.4,q:5},levels:{hat:1,shaker:.8},ghostHats:.1,
  bass:{sub:.95,mid:.35,bright:.15,steps:2},chords:{kind:'stab',level:1.6,cut:2200,decay:.18,room:.15,hall:.55,echo:0,tape:.6,range:[45,67],hold:2},lead:{kind:'stab',level:3,cut:2200,decay:.18,hall:.5,tape:.45,echo:0,width:1.4,map:{glass:'mallet',flute:'pad'}},sidechain:{floor:.4,release:.16},output:1.1},
 // Acid techno: a harder 303 (more resonance and drive, more accents and slides) over a punchy kick with its rumble.
 acid:{kit:{id:'acidtechno',kick:{click:.8,decay:.13,drive:3.6,length:.44,hold:.11,tail:.06},kickHz:50,hatTone:1.55},rumble:{level:.36,drive:3.6,q:7},levels:{kick:.54,hatO:.95,clap:.9},ghostHats:.1,
  bass:{kind:'acid',sub:.4,mid:1.1,steps:1,bright:.6,q:20,low:300,high:3400,cycle:16,slide:.36,accent:.45,drive:4.2},lead:{level:.65,map:{saw:'supersaw'}},sidechain:{floor:.3,release:.1},output:.78},
 // Minimal techno: dry and tight. A short clicky kick, crisp hats and rim, almost no room or echo, a little rumble.
 minimaltechno:{kit:{id:'minimaltechno',kick:{click:.85,decay:.09,drive:2.6,length:.32,hold:.07,tail:.04},kickHz:50,hatTone:1.62,clapRoom:.12,snareUnderClap:.25},rumble:{level:.14,drive:2.6,q:6},
  levels:{rim:.75,tom:.7,hat:1.3},room:{clap:.12,snare:.1,rim:.06,wood:.06,tom:.08,blip:.12},echo:{rim:.05,blip:.12,wood:0,tom:0},ghostHats:.18,
  bass:{sub:.7,mid:.75,bright:.4},lead:{kind:'stab',level:.75,cut:2200,room:.05,hall:.05,echo:.08,hold:1,map:{organ:'organ',keys:'stab',phasekeys:'stab'}},chords:{kind:'stab',cut:2000,room:.05,hall:.08,echo:.08,hold:1},sidechain:{floor:.32,release:.09}},
 // Detroit: warm strings and pads, bright 909 hats, soulful chords on Rhodes-like keys.
 detroit:{kit:{id:'detroit',kick:{click:.55,decay:.14,drive:2.6,length:.46,hold:.12,tail:.07},kickHz:50,hatTone:1.62},rumble:{level:.2,drive:2.4,q:6},levels:{hat:1.45,hatO:1.1,clap:.9},ghostHats:.26,
  bass:{sub:.65,mid:.8,bright:.35},lead:{kind:'strings',level:.85,hall:.4,echo:.22,hold:3,map:{strings:'strings',saw:'strings',reed:'strings',organ:'ep',keys:'ep',rhodes:'ep',phasekeys:'ep'}},chords:{kind:'strings',level:1.2,hall:.5,hold:6,map:{organ:'ep',keys:'ep',rhodes:'ep'}},sidechain:{floor:.32,release:.14}},
 // Melodic techno: big wide arps and pads that open over each 32-bar phrase, a deep kick with its rumble.
 melodictechno:{kit:{id:'melodictechno',kick:{click:.5,decay:.15,drive:2.8,length:.5,hold:.13,tail:.08},kickHz:46,hatTone:1.45},rumble:{level:.24,drive:2.8,q:6},levels:{hat:1.15,clap:.85},ghostHats:.12,
  bass:{sub:.55,mid:.85,bright:.32},lead:{kind:'arp',level:.85,hall:.45,echo:.42,width:1.6,map:{saw:'arp',strings:'pad',keys:'arp',pluck:'arp',phasekeys:'arp',p_gutguitar:'arp',p_barkkeys:'arp'}},chords:{kind:'pad',level:1.8,hall:.6,echo:.38,width:1.6,hold:10,map:{strings:'pad',silkstrings:'pad',keys:'pad',rhodes:'pad',organ:'pad',phasekeys:'arp'}},
  build:{bars:32,low:600,high:12000},sidechain:{floor:.26,release:.15},output:1.7},
 // Melodic house: plucks into the long echo and wide pads that open over each 32-bar phrase; the low tom answers in the hall.
 melodic:{kit:{id:'melodichouse',kick:{click:.28,decay:.16,drive:1.8,length:.5,hold:.13,tail:.09},kickHz:49},levels:{tom:.85,shaker:1.1},room:{tom:.48},bass:{sub:.56,mid:.55},
  lead:{level:1.05,echo:.52,hall:.32,map:{rhodes:'pluck',keys:'pluck',p_tinepiano:'pluck',tinepiano:'pluck',strings:'pad'}},chords:{level:2.3,hall:.55,echo:.3,width:1.7,hold:10,map:{strings:'pad',silkstrings:'pad',rhodes:'ep',keys:'ep',p_tinepiano:'pluck',tinepiano:'pluck'}},build:{bars:32,low:1600,high:12000},sidechain:{floor:.38,release:.15},output:.45},
 // Organic house: the softest kick, hand drums with longer skins, shakers up, string plucks and kalimba, warm keys.
 organic:{kit:{id:'organic',kick:{click:.14,decay:.19,drive:1.4,length:.54,hold:.14,tail:.1},kickHz:48,hatTone:1.3,congaDecay:.14,tomDecay:.22},levels:{kick:.42,shaker:1.15,conga:.95,wood:.8,hat:.9},room:{conga:.34,wood:.34},echo:{wood:.16,conga:.1},ghostHats:.08,
  lead:{kind:'string',echo:.42,hall:.3},chords:{kind:'ep',level:1.2,hall:.5,hold:4,map:{strings:'pad',silkstrings:'pad',bowed:'pad',cellobody:'pad',p_cellobody:'pad'}},sidechain:{floor:.5,release:.16},output:2.1},
 // Afro house: marimba and flute over rolling hand drums, a firmer kick, pads underneath.
 afro:{kit:{id:'afrohouse',kick:{click:.45,decay:.14,drive:2.3,length:.46,hold:.12,tail:.07},kickHz:51},levels:{conga:.95,shaker:1.1,tom:.85},ghostHats:.2,sidechain:{floor:.4,release:.12},output:.55},
 // Amapiano: the log drum is the bass (a pitched, knocking drum that drops), piano chords, rim and shaker, little pump.
 amapiano:{kit:{id:'amapiano',kick:{click:.2,decay:.16,drive:1.6,length:.48,hold:.12,tail:.08},kickHz:50,hatTone:1.45},levels:{kick:.4,shaker:1.25,rim:.8,conga:.8},ghostHats:.1,
  bass:{kind:'logdrum',sub:.6,mid:.7,steps:2,bright:.2,drop:.9,decay:1,knock:.35,drive:1.8},lead:{kind:'piano',level:.8,hall:.28,map:{rhodes:'piano',keys:'piano',feltpiano:'piano'}},chords:{kind:'piano',level:1.1,hall:.4,hold:4,map:{rhodes:'piano',keys:'piano',feltpiano:'piano',strings:'pad'}},sidechain:{floor:.6,release:.12},output:.5},
 // Tribal: toms with long skins and room, a hard kick, chant-like formant hits (synthetic vowels) for the melody.
 tribal:{kit:{id:'tribal',kick:{click:.55,decay:.15,drive:2.8,length:.46,hold:.12,tail:.07},kickHz:50,hatTone:1.45,tomDecay:.28,congaDecay:.12},levels:{kick:.5,tom:1.1,conga:.95,wood:.8},room:{tom:.48,conga:.34},echo:{tom:.1},ghostHats:.12,
  lead:{kind:'chant',level:.9,hall:.35,echo:.26,map:{organ:'chant',membrane:'chant',marimba:'mallet'}},chords:{kind:'pad',level:1,hall:.45},answer:{id:'tom',mult:2},sidechain:{floor:.36,release:.12},output:.55},
 // Electrónica andina: pan flute and charango-like double-course plucks, a bombo legüero (low, long, with its skin), wood.
 andean:{kit:{id:'andean',kick:{click:.12,decay:.26,drive:1.5,length:.72,hold:.16,tail:.14,skin:.45},kickHz:44,hatTone:1.32,congaDecay:.12},levels:{kick:.5,wood:.95,conga:.85,shaker:1.1},room:{wood:.34,conga:.3},echo:{wood:.14},ghostHats:.06,
  lead:{kind:'flute',level:.9,hall:.32,echo:.3,map:{kalimba:'charango',marimba:'charango',gutguitar:'charango',p_gutguitar:'charango',steel:'charango'}},chords:{kind:'charango',level:1,hall:.35,echo:.12,hold:3,map:{kalimba:'charango',gutguitar:'charango',p_gutguitar:'charango',strings:'pad',cellobody:'pad',p_cellobody:'pad'}},answer:{id:'wood',mult:1},sidechain:{floor:.5,release:.15},output:3.3}
});
const plainObj=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
function freezeDeep(o){if(plainObj(o)){for(const v of Object.values(o))freezeDeep(v);Object.freeze(o);}return o;}
function touched(base,touch){if(!touch)return base;const out={...base};for(const [k,v] of Object.entries(touch)){const b=base[k];
 out[k]=plainObj(v)&&plainObj(b)?Object.fromEntries([...Object.entries(b),...Object.entries(v).map(([k2,v2])=>[k2,plainObj(v2)&&plainObj(b[k2])?{...b[k2],...v2}:v2])]):v;}return freezeDeep(out);}
const PROFILES=Object.freeze({tech:TECH,house:HOUSE,techno:TECHNO,melodic:MELODIC,afro:AFRO,disco:DISCO,uk:UK,bass:BASS,dnb:DNB,hiphop:HIPHOP,electro:ELECTRO,ambient:AMBIENT,jazz:JAZZ,experimental:EXPERIMENTAL});
const CLASSIC=Object.freeze({ready:false});
const MEMO=new Map();
export function soundProfile(genre){let p=MEMO.get(genre);if(!p){const f=soundFamily(genre);p=f&&PROFILES[f.id]?Object.freeze({family:f.id,name:f.name,...touched(PROFILES[f.id],GENRE_TOUCH[genre])}):Object.freeze({family:f?.id||null,name:f?.name||null,...CLASSIC});if(MEMO.size<128)MEMO.set(genre,p);}return p;}
export const convertedGenre=genre=>soundProfile(genre).ready===true;
export const convertedFamilies=()=>SOUND_FAMILIES.filter(f=>PROFILES[f.id]?.ready).map(f=>f.id);

// ---------- the setting (S.soundPro) ----------
// «Sonido clásico» off by default: converted families sound new. Unknown fields are kept; a later version is left
// untouched and reads as the default (new sound).
export const SOUND_PRO_VERSION=1;
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function normalizeSoundPro(raw){if(plain(raw)&&Number.isInteger(raw.version)&&raw.version>SOUND_PRO_VERSION)return raw;const q=plain(raw)?raw:{};return {...q,version:SOUND_PRO_VERSION,classic:q.classic===true};}
export const soundProWritable=q=>q?.version===SOUND_PRO_VERSION;
export const soundProClassic=q=>soundProWritable(q)&&q.classic===true;

// ---------- region transitions, DJ style ----------
// Mirrors territory-journey.js from the cues it already sends each bar (it is not changed): the guest region comes in
// filtered and without bass, a riser announces the swap two bars ahead, the kick drops out for the last half bar and
// an impact marks the swap, where the bass changes hands.
export const GUEST_HIGHPASS=170;
export function guestFilter(w){const k=Math.max(0,Math.min(1,(Number.isFinite(w)?w:0)/.45));return {highpass:GUEST_HIGHPASS,lowpass:Math.round(700*Math.pow(20000/700,k))};}
export function createTransitionTracker(){
 let primary=null,secondary=null,primarySince=0,guestSince=0,last=null;
 function reset(){primary=null;secondary=null;primarySince=0;guestSince=0;last=null;}
 function advance(f){
  const bar=f.bar;
  if(last!==null&&bar<last)reset();
  if(primary===null||f.primary!==primary&&!f.swap){primarySince=bar;guestSince=bar;}
  else if(f.swap)primarySince=bar;
  else if((f.secondary||null)!==secondary)guestSince=bar;
  primary=f.primary;secondary=f.secondary||null;last=bar;
  // The journey swaps on a bar that is a multiple of 8, with the guest at half or more, the primary there for 8 bars
  // and the guest for 4, once you are in the guest's ground: only then does the guest pass one half.
  const swapIn=k=>{const b=bar+k;return !!secondary&&b%8===0&&b-primarySince>=8&&b-guestSince>=4&&(f.to??0)>.5+1e-9;};
  const phrase=bar-primarySince;
  return {bar,primary,secondary,impact:f.swap===true,drop:swapIn(1),riser:swapIn(2)?2:0,
   crash:!f.swap&&phrase>0&&phrase%16===0,sweep:phrase%32===31,phrase,
   from:Number.isFinite(f.from)?f.from:0,to:Number.isFinite(f.to)?f.to:0};
 }
 return {advance,reset};
}
