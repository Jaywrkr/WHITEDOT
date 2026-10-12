// Propiedad regional independiente del RNG del mapa y del guardado.
const LEVELS = [
  { name: 'Gravedad ligera', movement: 'Movimiento rápido', multiplier: 1.35 },
  { name: 'Gravedad normal', movement: 'Movimiento equilibrado', multiplier: 1 },
  { name: 'Gravedad alta', movement: 'Movimiento lento', multiplier: .7 },
];
export function gravityOf(region, seedOf) {
  return LEVELS[region.key === '0,0' ? 1 : seedOf(`gravity:v1:${region.key}`) % LEVELS.length];
}

export function movementMultiplier(x, y, size, regionOfPos, seedOf) {
  const band = size / 4;
  function axis(value) {
    const local = ((value % size) + size) % size;
    const distance = Math.min(local, size - local);
    if (distance >= band) return [[0, 1]];
    const direction = local < size / 2 ? -1 : 1;
    const weight = .5 * (1 - distance / band);
    return [[0, 1 - weight], [direction * (distance + 1), weight]];
  }
  // Mezclar ambos ejes evita saltos también en las esquinas y coordenadas negativas.
  let result = 0;
  for (const [dx, wx] of axis(x)) for (const [dy, wy] of axis(y)) {
    result += gravityOf(regionOfPos(x + dx, y + dy), seedOf).multiplier * wx * wy;
  }
  return result;
}
