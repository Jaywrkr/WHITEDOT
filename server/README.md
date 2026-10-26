# Prototipo Python/SQLite heredado

Este directorio no inicia el cliente estático ni es el backend de cuentas de Kubono. Se conserva porque `tests/server_api.py` prueba su API histórica.

El producto usa guardado local y cuenta opcional mediante los módulos cloud; la configuración de Supabase está pausada. No conectar el cliente a `/api/session` ni reactivar salas/duetos para corregir un error de render.

Para jugar, servir la raíz con `python3 -m http.server 8000`. [Mapa técnico](../docs/ARQUITECTURA.md) · [traspaso](../HANDOFF.md). `server/data/` contiene datos locales ignorados; esta limpieza no los toca.
