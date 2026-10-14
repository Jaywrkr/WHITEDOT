# Servidor y duetos · 1.1.0-alpha.10

El juego conserva su modo estático, local y offline. El servicio es opcional y experimental; todavía no está publicado en un dominio ni aceptado como servicio de producción.

## Ejecutar y verificar

Desde la raíz del repositorio, con Python 3.10 o superior:

```sh
python3 server/app.py --host 127.0.0.1 --port 8080
```

Sirve el juego y la API del mismo origen. `GET /api/health` debe devolver HTTP 200 y `service: whitedot`. SQLite usa `server/data/world.sqlite`, excluido de Git. No necesita instalar paquetes ni crear un secreto para desarrollo. Las instrucciones de arranque y verificación se guardaron también en el borrador de configuración del entorno de Codex; revisar, guardar y publicar ese entorno activa la configuración. Ese paso no publica el juego.

Pruebas reproducibles, con bases temporales:

```sh
python3 tests/server_api.py
python3 tests/duet_smoke.py
```

La segunda usa Playwright y Chromium. Comprueba dos sesiones separadas, presencia, notas al mismo paso musical y reparto complementario. `tests/duet-harmony.mjs` comprueba entrada tardía: frase, armonía, instrumento, bajo y motivo siguen el reloj de la sala.

## Usarlo en el juego

Menú → **Cuenta y duetos**. Puedes crear una cuenta, entrar o usar un invitado. La interfaz no produce sonidos. Una cuenta permite subir, recuperar o descargar una copia; el invitado conserva el progreso local. No se sincroniza ni reemplaza una partida sin una acción explícita.

Crear sala genera un código privado para dos personas. La otra persona abre la misma semilla/versión y se une con el código. Unirse la sitúa cerca del anfitrión en la misma capa. La sala comparte un entorno de ±5.000 unidades, con un cubo distinguible, tempo y armonía comunes. Las contribuciones se reparten en graves/armonía y percusión/frases. Los gestos viajan con anticipación y se reproducen en una cuadrícula compartida; eventos demasiado atrasados se descartan para evitar ráfagas.

No es streaming de audio: ambos dispositivos sintetizan localmente. La compensación de reloj usa el tiempo de respuesta del servidor; la prueba local demuestra coincidencia de pasos, no garantiza latencia por Internet o entre altavoces físicos. Las salas duran hasta dos horas y desaparecen al vaciarse; una presencia expira tras 30 segundos sin contacto. La suspensión puede terminar una sesión, pero no elimina el progreso local.

Las construcciones abiertas se comparten y permanecen en SQLite, con máximo de 512 marcas por mundo. Es memoria cooperativa ligera, no un mundo editable autoritativo ni un inventario competitivo.

## Copias y conflictos

Cada partida/semilla tiene su propio ámbito y revisión. Una subida usa la revisión conocida: si otra copia cambió, devuelve conflicto y no sobrescribe. Descargar un respaldo remoto no cambia la partida local. Recuperar valida mundo, versión y estructura, conserva el estado local anterior y actualiza la revisión. Usa Progreso y respaldo para conservar tu copia local antes de resolver un conflicto.

El servicio admite hasta 64 copias por cuenta. No hay recuperación de contraseña, correo, MFA ni administración pública de cuentas todavía. No se presenta esta implementación como preparada para abrir registro masivo.

## Publicar después de elegir alojamiento

1. Elegir servidor y dominio; apuntar DNS.
2. Ejecutar el backend como servicio privado con un directorio de datos persistente y respaldado. Definir `WD_DATABASE` con la ruta elegida y `WD_ORIGIN` con el origen HTTPS exacto.
3. Usar un proxy HTTPS, por ejemplo [server/Caddyfile.example](server/Caddyfile.example), delante del proceso privado. No exponer SQLite ni el directorio del servidor como archivos públicos.
4. Preparar un artefacto de despliegue y ejecutar `scripts/stamp-deploy.mjs` con su directorio, revisión Git y hora UTC real de publicación. Publicarlo de forma atómica. El repositorio mantiene `deployedAt: null`: un commit no es un deploy.
5. Exportar e importar el progreso si cambia el origen del sitio; el almacenamiento local de un dominio no aparece automáticamente en otro.
6. Probar iPhone/Android físicos, Safari/Chrome, suspensión, latencia de dos redes, actualización offline, recuperación de copia y escucha humana antes de una apertura pública.

El backend aplica contraseñas derivadas con scrypt, sesiones HttpOnly/SameSite, cookies Secure con HTTPS, verificación de origen/CSRF, límites de solicitudes y cuerpos, consultas parametrizadas, revisiones de copias y archivos estáticos permitidos. Requiere una revisión adicional antes de producción: recuperación/borrado de cuentas, retención, monitorización, respaldos y restauración operativa, protección contra abuso y escalado. Las salas viven en memoria de un proceso; cuentas, copias y marcas viven en SQLite. Reiniciar corta las salas, conservando los datos persistentes.
