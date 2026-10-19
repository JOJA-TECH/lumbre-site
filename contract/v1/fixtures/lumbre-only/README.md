# Fixtures locales de publicación Lumbre

Estos casos ejercitan reglas de publicación que el validador actual de Atelier no prueba. El autotest actual de Atelier recorre únicamente los directorios `fixtures/valid/` y `fixtures/invalid/` de primer nivel; por eso estos casos viven bajo `lumbre-only/`. Cada archivo es JSON con `case_version`, `id`, `expected`, `rule`, `publication` y opcionalmente `bodies`. `bodies[].chapter_index` enlaza el Markdown sintético al índice del capítulo dentro de `publication.capitulos`.

Todos los textos y metadatos son sintéticos. `DEMO_ONLY_NOT_A_REAL_KEY` no es una credencial. El validador de Lumbre F1 ejecutará los casos y comprobará que los aceptados pasen y los rechazados fallen por la regla indicada.

| Caso | Esperado | Regla `PUB-3` | Validador actual |
|---|---|---|---|
| `valid/serial-tres-capitulos.json` | aceptar | Serial válido con tres capítulos y cuerpos no vacíos | Lumbre F1; Atelier aún no recorre este grupo |
| `invalid/slug-duplicado.json` | rechazar | Slug duplicado dentro de la obra | Lumbre F1; Atelier aún no |
| `invalid/order-duplicado.json` | rechazar | `order` repetido en serial | Lumbre F1; Atelier aún no |
| `invalid/cuerpo-vacio.json` | rechazar | Cuerpo Markdown vacío | Lumbre F1; Atelier aún no recorre este formato de caso |
| `invalid/enlace-interno-roto.json` | rechazar | Enlace interno no resoluble | Lumbre F1; Atelier aún no |
| `invalid/prompt-en-cuerpo.json` | rechazar | Prompt interno filtrado | Lumbre F1; Atelier aún no |
| `invalid/id-interno-en-cuerpo.json` | rechazar | Identificador interno filtrado | Lumbre F1; Atelier aún no |
| `invalid/ruta-local-en-cuerpo.json` | rechazar | Ruta local filtrada | Lumbre F1; Atelier aún no |
| `invalid/clave-sintetica-en-cuerpo.json` | rechazar | Patrón con apariencia de clave | Lumbre F1; Atelier aún no |

El paquete completo debe copiarse sin cambios a `deepwrite-atelier/contracts/v1/` y su `SHA256SUMS` recalcularse allí. El autotest actual de Atelier solo ejecuta fixtures JSON ubicadas directamente en `valid/` e `invalid/`; copiar el grupo Lumbre-only no hace que Atelier las pruebe. `INT-1` no se cierra hasta que la persona responsable de Atelier revise la matriz, hash y brecha de cobertura.
