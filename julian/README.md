# Tomas de Julián

App web instalable (PWA) para registrar las tomas de un recién nacido: inicio y fin, mama izquierda/derecha, tiempo efectivo de alimentación y aviso de la próxima toma. Funciona sin conexión y guarda los datos solo en el teléfono.

## Cómo usarla en el teléfono

1. Publica la carpeta `julian/` en cualquier hosting estático (por ejemplo GitHub Pages: *Settings → Pages → Deploy from branch*). La URL quedará como `https://<usuario>.github.io/Juego/julian/`.
2. Abre esa URL en el teléfono e instálala:
   - **iPhone (Safari):** Compartir → *Añadir a pantalla de inicio*.
   - **Android (Chrome):** menú ⋮ → *Instalar app*.
3. En **Ajustes** activa las notificaciones y elige cada cuánto debe comer.

Las notificaciones requieren HTTPS. En Android suelen llegar aunque la app esté cerrada; en iPhone solo mientras la app está abierta o quedó en segundo plano hace poco (Safari no permite avisos programados sin servidor).

## Qué toma de cada app existente

| Idea | Inspirada en |
|---|---|
| Dos botones grandes por mama, el cronómetro arranca con un toque | Baby Feed Timer, Le Baby |
| Recuerda el último lado y sugiere el contrario | Amme, Baby Daybook |
| Cambio de lado dentro de la misma toma con tiempos separados | Huckleberry, Amme |
| Pausa para eructo o pañal que no cuenta como tiempo de alimentación | Sprout, ParentLove |
| Cuenta regresiva con "próxima a las" y "faltan", contada desde inicio o fin | ParentLove, Baby Feed Timer |
| Historial editable con intervalo entre tomas y resumen diario | Huckleberry, Baby Daybook |

## Archivos

- `index.html`: toda la app (HTML, CSS y JS).
- `sw.js`: service worker para uso sin conexión y alarma en segundo plano.
- `manifest.webmanifest` e íconos: instalación en pantalla de inicio.

## Copia de seguridad

En **Ajustes** puedes exportar un CSV para Excel o una copia JSON completa, y restaurarla en otro teléfono.
