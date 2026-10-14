# Contract — Contrato de contenido (fuente de verdad)

> **Lumbre es dueño del contrato**; Atelier se ajusta a él (`ADR-INT-001`). Esta carpeta es la **fuente**.
> Atelier mantiene una **copia fijada con hash** en `deepwrite-atelier/contracts/`.

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
| `v1/fixtures/invalid/falta-campo.json` | Falta `synopsis` en la obra. |

Las fixtures se comparten: Atelier las usa para probar su exportador; Lumbre, para su validador (`CON-4`).

## Cambios

Registrar aquí cada cambio de contrato con fecha y motivo.

| Fecha | Cambio | Motivo |
|---|---|---|
| 2026-10-13 | v1 inicial | `ADR-INT-001`: formaliza el borrador de `AGENTS.md` §7. |
