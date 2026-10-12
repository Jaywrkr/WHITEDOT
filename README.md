# WHITEDOT · Pixel Blanco

Un pixel blanco en un mundo negro. Cada día avanzas un camino corto, y cuando lo terminas se abre un **Mundo infinito y procedural donde todo hace música**: electrónica que va del ambient al minimal tech house. Cada región tiene su género, su paisaje y sus criaturas, y todo lo que tocas suena a tempo.

**Jugar:** https://whitedot-inky.vercel.app (funciona en móvil y desktop, con audio. Toca la pantalla una vez para activar el sonido.)

Por Jay · [@jaywrkr](https://instagram.com/jaywrkr)

---

## Cómo se juega

1. **Camino del día:** mueve el pixel (arrastra o usa WASD/flechas) y recoge luces. La barra tiene un tope diario. Volver cada día suma racha.
2. **Mundo:** al terminar el camino entras al Mundo. Tu linterna dura 10 minutos, más 1 minuto por día de racha (máximo 60). El tiempo de linterna se pausa mientras consultas menús y paneles.
3. **Explora:** las regiones son grandes y cambian poco a poco, igual que bajar de la sierra a la costa. Cada una tiene un género (afro house, minimal, rominimal, dub techno, acid, garage…), su escala, su suelo, su aire y su fauna.
4. **Interactúa:**
   - Choca objetos.
   - Lanza un **pulso** tocando la pantalla o con Espacio.
   - Deja que las criaturas te sigan y canten.
   - Cumple el reto de cada región.
5. **Estudio:** un secuenciador radial portátil. Lo armas con las muestras que recoges y lo despliegas como refugio, que también sirve de checkpoint.
6. **Logros:** absurdos, y muchos ocultos. La Voz del sistema comenta lo que haces sin pedir permiso.
7. **Compartir:** genera una tarjeta para redes con tu racha y tus descubrimientos.

## Tecnología

- Un solo archivo: `index.html`.
- Canvas 2D y Web Audio API. Todo el sonido se sintetiza en vivo, sin samples.
- Sin dependencias ni build.
- Guarda el progreso en `localStorage` (clave `pixel-blanco-v4`).

## Correr local

```bash
npx serve .        # o: python3 -m http.server 8000
```

Abre `http://localhost:8000`. También puedes abrir `index.html` directo en el navegador.

## Deploy

El repo está conectado a Vercel (proyecto `whitedot`). Cada push a `main` despliega producción automáticamente. No hay paso de build: Vercel sirve `index.html` tal cual.

## Para seguir desarrollando

Lee **[HANDOFF.md](HANDOFF.md)**. Tiene todo el contexto: visión, decisiones tomadas, arquitectura del código, sistemas, cómo probar y el roadmap. Está pensado para pegarlo en otra IA (ChatGPT, Claude, etc.) y seguir sin perder nada.
