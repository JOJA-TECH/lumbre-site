# Contract — Contrato de contenido (fuente de verdad)
> **Lumbre es dueño del contrato**; Atelier se ajusta a él (`ADR-INT-001`). Esta carpeta es la **fuente**.
> Atelier mantiene una **copia fijada con hash** en `deepwrite-atelier/contracts/`.
El manifiesto fuente [`SHA256SUMS`](SHA256SUMS) lista, con rutas relativas `v1/`, todos los archivos del paquete. Al sincronizarlo, se copian `contract/v1/` y el manifiesto a `contracts/` en Atelier; allí se recalculan los SHA-256 y se comparan antes de ejecutar el autotest. Una coincidencia prueba identidad de archivos, no paridad de reglas que cada validador ejecuta.


## Versión

- **Versión actual:** `v1` (schema en [`v1/`](v1/)).
- Cambiar nombres o semántica de campos ⇒ **ADR + nueva `contract_version`**. Los schemas son **inmutables** una vez usados en una publicación real; una corrección = nueva versión.

## Modelo

| Entidad | Archivo en Lumbre | Schema |
|---|---|---|
| Obra | `content/<work>/_obra.md` | [`v1/obra.schema.json`](v1/obra.schema.json) |
| Capítulo / pieza | `content/<work>/<slug>.md` | [`v1/capitulo.schema.json`](v1/capitulo.schema.json) |
| Publicación (obra + capítulos) | — (lote lógico) | [`v1/publicacion.schema.json`](v1/publicacion.schema.json) |

El frontmatter es **YAML**; los schemas describen los campos. El cuerpo Markdown es el texto de la pieza.

## Reglas

- **Estricto con lista permitida** (`CON-3`): un campo desconocido es un error. No hay lista negra de campos privados.
- **Estado:** producción acepta solo `status: publicado` (`CON-2`).
- **`uid`:** id público opaco y estable; permite conservar la URL si cambia el slug.
- **`source_revision`:** hash del export de Atelier; identifica la versión exacta exportada.

### Lo que JSON Schema **no** puede expresar (lo aplica el validador, Lumbre F1)

- Unicidad de `slug` y de `order` dentro de una obra.
- `date_published` no futura y `updated` ≥ `date_published`.
- Contenido no vacío y ausencia de enlaces internos rotos.
- Detección de prompts, IDs internos, rutas locales y claves en el cuerpo (`PUB-3`).

## Fixtures

| Ruta | Qué valida |
|---|---|
| `v1/fixtures/valid/relato.json` | Obra tipo `relato`, un capítulo. |
| `v1/fixtures/valid/serial.json` | Obra tipo `serial`, tres capítulos con `order`. |
| `v1/fixtures/invalid/campo-desconocido.json` | Campo privado desconocido (`CON-3`). |
| `v1/fixtures/invalid/estado-borrador.json` | Estado no publicable (`CON-2`). |
| `v1/fixtures/invalid/serial-sin-order.json` | Serial sin `order`. |
| `v1/fixtures/invalid/fecha-invalida.json` | Fecha con formato incorrecto. |
| `v1/fixtures/invalid/fecha-futura.json` | Fecha futura rechazada por validación adicional del lote. |
| `v1/fixtures/invalid/falta-campo.json` | Falta `synopsis` en la obra. |

Las fixtures de esquema en `v1/fixtures/valid/` y `v1/fixtures/invalid/` son compartidas: Atelier las usa en su autotest y Lumbre las usará en su validador (`CON-4`). Los casos de publicación adicionales viven bajo `v1/fixtures/lumbre-only/` porque el validador actual de Atelier no ejecuta unicidad de slug/order ni los detectores del cuerpo. El formato y expectativas están en [`lumbre-only/README.md`](v1/fixtures/lumbre-only/README.md). Aunque el paquete completo se copie y se verifique por SHA-256 en Atelier, una copia igual no equivale a que ambos validadores comprueben todas las mismas reglas.

## Cambios

Registrar aquí cada cambio de contrato con fecha y motivo.

| Fecha | Cambio | Motivo |
|---|---|---|
| 2026-10-13 | v1 inicial | `ADR-INT-001`: formaliza el borrador de `AGENTS.md` §7. |
| 2026-10-15 | Grupo sintético `lumbre-only` y manifiesto fuente | `SPEC-001` + `ADR-INT-003`: cubre publicación/cuerpo sin añadir campos al contrato ni romper el autotest actual de Atelier. Requiere sincronización del paquete por el mantenedor de Atelier para cerrar `INT-1`. |
