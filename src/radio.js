// Composición por frases: el reloj musical avanza sin necesitar movimiento.
// No modifica el ADN de la región ni guarda estado en la partida.
export function createRadio(seedOf, rng, genres) {
  let regionKey = null, phrase = -1, nextPhrase = 0, nextSection = 0;
  let section = 0, energy = .25, arrangement = null;
  const levels = [.24, .43, .62, .3];

  function advance(region, bar, environment = {}) {
    if (region.key !== regionKey) {
      regionKey = region.key;
      phrase = -1;
      nextPhrase = nextSection = bar;
      section = 0;
      energy = region.genre === 'ambient' ? .16 : .25;
      arrangement = null;
    }
    if (bar >= nextPhrase) {
      phrase++;
      const random = rng(seedOf(`radio:${region.key}:${phrase}`));
      if (bar >= nextSection) {
        // Cada sección lleva a otra; no se vuelve a una grabación en bucle.
        section = (section + 1 + Math.floor(random() * 3)) % levels.length;
        nextSection = bar + 12 + Math.floor(random() * 4) * 4;
      }
      const sparse = section === 0;
      const shift = [-2, -1, 0, 1, 2][Math.floor(random() * 5)];
      const bass = region.track.bass.map((degree, step) => {
        if (region.genre === 'rominimal') degree = step % 2 ? (step % 8 === 7 ? 4 : 0) : -1;
        if (region.genre === 'dubstep') degree = [0,3,4,10,14].includes(step) ? [0,0,4,7][Math.floor(random()*4)] : -1;
        if (region.genre === 'dnb') degree = [0,2,6,8,10,14].includes(step) ? [0,4,7][Math.floor(random()*3)] : -1;
        if (region.genre === 'progressive') degree = step%2===0 ? (step%8===6?4:0) : -1;
        if (region.genre === 'acid') degree = [1,0,1,1,0,1,0,2,1,0,1,0,2,1,0,1][step] ? (step === 7 || step === 12 ? 7 : 0) : -1;
        if (degree < 0 || (step !== 0 && random() < (sparse ? .45 : .12))) return -1;
        return step === 0 ? 0 : Math.max(0, Math.min(9, degree + (random() < .3 ? shift : 0)));
      });
      const hook = region.track.hook.map((degree, step) => {
        if (degree < 0) return !sparse && step % 4 === 2 && random() < .3 ? 2 + Math.floor(random() * 5) : -1;
        if (random() < (sparse ? .5 : .18)) return -1;
        return Math.max(0, Math.min(11, degree + shift + (random() < .25 ? 2 : 0)));
      });
      // Siempre hay una voz melódica, incluso en un rincón sin fauna u objetos.
      if ([0, 4, 8, 12].every(step => hook[step] < 0)) hook[Math.floor(random() * 4) * 4] = 2;
      if (arrangement && hook.every((degree, i) => degree === arrangement.hook[i])) {
        const i = hook.findIndex(degree => degree >= 0);
        hook[i] = (hook[i] + 1) % 12;
      }
      const pool = genres[region.genre].hookP;
      arrangement = { phrase, section, bass, hook, hookI: pool[Math.floor(random() * pool.length)] };
      nextPhrase = bar + 4 + Math.floor(random() * 3) * 2;
    }
    const life = Math.min(.08, (environment.near || 0) * .002 + (environment.singers || 0) * .015);
    const event = environment.event === 'eclipse' ? -.06 : environment.event ? .05 : 0;
    const density = environment.variant === 0 ? -.05 : environment.variant === 4 ? .04 : 0;
    const limit = environment.quiet ? .24 : region.genre === 'ambient' ? .3 : .7;
    const target = Math.max(.14, Math.min(limit, levels[section] + life + event + density));
    energy += (target - energy) * .25;
    return { ...arrangement, energy, genre: region.genre };
  }
  return { advance };
}
