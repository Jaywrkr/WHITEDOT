# Privacidad de Kubono · borrador

Borrador del 6 de noviembre de 2026 (alpha.273), no publicado. Describe las ediciones de venta: Android y escritorio (Windows, macOS y Linux), sin cuenta ni nube. La cuenta opcional está aprobada, pero su configuración (Supabase) está en pausa y no forma parte de esta edición. Si vuelve, esta política se reescribe antes. [Índice vigente](README.md).

Antes de publicar, Jay completa `[NOMBRE LEGAL]`, `[CORREO]` y `[FECHA]`, y la publica en una URL propia: Google Play la pide en su consola.

## Texto para publicar · español

**Política de privacidad de Kubono**

Responsable: [NOMBRE LEGAL]. Contacto: [CORREO]. En vigor desde: [FECHA].

Kubono no recoge datos personales. Todo queda en tu dispositivo.

- **Sin cuenta.** No hay registro, correo ni contraseña.
- **Sin conexión.** El juego no envía nada a internet. No hay servidores nuestros que reciban tu partida.
- **Sin analítica ni anuncios.** No hay SDK de terceros, ni de analítica, ni de publicidad, ni de seguimiento.
- **Tu partida.** Se guarda solo en el dispositivo: progreso, ajustes e idioma. Nadie más la ve.
- **Errores.** Si algo falla, el juego guarda en el dispositivo sus últimos 20 errores, sin partida ni datos personales. No se envían. Solo salen si tú eliges «Copiar diagnóstico» en Ajustes y pegas el texto.
- **Guardar copia y compartir.** «Guardar copia» crea un archivo que tú guardas donde quieras. Compartir usa el menú de tu sistema y solo envía lo que tú eliges, a quien tú eliges.
- **Sin micrófono, cámara ni ubicación.** La música se genera en el dispositivo. Las coordenadas del cubo son del mundo del juego, no tu ubicación.
- **Compras.** Kubono se paga una vez. La tienda donde lo compras (Google Play, itch.io u otra) gestiona el pago con su propia política. Dentro del juego no hay compras: las chispas solo se ganan jugando.
- **Borrar tus datos.** Desinstala el juego o borra sus datos desde el sistema. También puedes usar «Empezar de cero» en Ajustes. No guardamos ninguna copia.
- **Menores.** No recogemos datos de nadie, tampoco de menores.
- **Cambios.** Si una versión futura cambia algo de esto, actualizaremos esta página antes de publicarla.

Preguntas: [CORREO].

## Text to publish · English

**Kubono privacy policy**

Controller: [NOMBRE LEGAL]. Contact: [CORREO]. Effective from: [FECHA].

Kubono collects no personal data. Everything stays on your device.

- **No account.** No sign-up, email or password.
- **No connection.** The game sends nothing to the internet. No server of ours receives your game.
- **No analytics or ads.** No third-party SDKs: no analytics, advertising or tracking.
- **Your game.** It is saved only on your device: progress, settings and language. Nobody else sees it.
- **Errors.** If something fails, the game keeps its last 20 errors on the device, with no game data or personal data. They are not sent. They only leave if you choose "Copy diagnostics" in Settings and paste the text.
- **Save a copy and sharing.** "Save a copy" creates a file you keep wherever you like. Sharing uses your system's menu and only sends what you choose, to whom you choose.
- **No microphone, camera or location.** The music is generated on the device. The cube's coordinates belong to the game world, not to your location.
- **Purchases.** Kubono is paid once. The store you buy it from (Google Play, itch.io or another) handles payment under its own policy. There are no purchases inside the game: sparks are only earned by playing.
- **Deleting your data.** Uninstall the game or clear its data from your system. You can also use "Start over" in Settings. We keep no copy.
- **Children.** We collect no data from anyone, children included.
- **Changes.** If a future version changes any of this, we will update this page before releasing it.

Questions: [CORREO].

## Notas para Jay (no publicar)

- **Comprobado en el código** (alpha.271–274): la auditoría de venta no vio peticiones fuera del propio origen; la edición de venta (`scripts/itch-package.mjs`, `sale_edition_smoke.py`) no tiene botón de cuenta ni nube. No hay SDK de terceros en el árbol.
- **Android.** Desde alpha.274 la edición de venta (`KUBONO_EDITION=store`) no pide el permiso `INTERNET`: `android/app/src/store/AndroidManifest.xml` lo quita al fusionar el manifiesto. No lo necesita: el juego se sirve desde el APK con `WebViewAssetLoader`, que responde sin red, y los enlaces se abren en otras apps. La vista previa con cuenta lo conserva para su nube. Falta compilar ese APK y abrirlo en un emulador para confirmarlo. En el formulario de seguridad de datos de Play: «No se recogen datos» y «No se comparten datos».
- **Web.** Si se publica una versión web, el alojamiento (hoy Vercel) guarda registros técnicos de las visitas (IP, hora). Entonces hay que nombrarlo aquí.
- **Cuenta.** Si vuelve la cuenta opcional, la política anterior (correo, sesiones, Supabase, eliminación) está en el historial de Git de este archivo y en [Eliminación de datos](ELIMINACION_DATOS.md).
- Público objetivo aprobado: 16 años o más. La clasificación la da el cuestionario de cada tienda.
