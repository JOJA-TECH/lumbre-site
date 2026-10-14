# ADR-INT-001: Contrato de contenido v1 (obra y capítulo)

- **Estado:** Aceptado
- **Fecha:** 2026-10-13
- **Alcance:** Integración (Atelier → Lumbre)
- **Motivada por:** hito `INT-1` · criterios `LU-F0-S2`, `LU-F0-S5`, `AT-F0-S1`, `AT-F0-S2` · riesgo `R-LU-04`
- **Reglas afectadas:** `CON-1`…`CON-5`, `PUB-2`, `PUB-3` (Lumbre `AGENTS.md`)
- **Revisar cuando:** se necesite un campo nuevo o cambie la semántica de uno existente (⇒ nueva `contract_version`), o Atelier necesite representar algo que el contrato no cubra.

## Contexto

Atelier exporta capítulos aprobados como **Markdown con frontmatter** hacia Lumbre. Dos repos deben coincidir en la forma exacta de ese frontmatter; el riesgo `R-LU-04` es que el contrato se **duplique y diverja**. Lumbre es el consumidor y, por tanto, **dueño del contrato**. Antes de este ADR, `AGENTS.md` §7 contenía un borrador "propuesto".

## Decisión

Se fija el **contrato de contenido v1** como JSON Schema versionado en [`contract/`](../../contract/README.md), inmutable una vez usado en una publicación real.

- **Obra** — `content/<work>/_obra.md`: `contract_version`, `work`, `title`, `author`, `lang`, `type` (`relato`|`serial`), `synopsis`; opcional `tags`.
- **Capítulo/pieza** — `content/<work>/<slug>.md`: `contract_version`, `work`, `slug`, `title`, `uid`, `status` (`publicado`), `date_published`, `source_revision`; `order` (obligatorio si la obra es `serial`); opcionales `synopsis`, `updated`.
- **Estricto con lista permitida:** un campo desconocido es un error (`CON-3`).
- **Fuente única:** `lumbre-site/contract/`. Atelier guarda una **copia fijada con hash** en `contracts/` y **fixtures compartidas**.
- Cambiar nombres o semántica de campos exige **ADR + nueva `contract_version`**.

Detalles verificables:

- El schema compuesto (`publicacion.schema.json`) exige `order` en los capítulos cuando `obra.type: serial`.
- Lo que JSON Schema no expresa (unicidad de `slug`/`order`, fecha no futura, contenido no vacío, enlaces internos, campos privados en el cuerpo) lo aplica el **validador** (Lumbre F1) y el exportador de Atelier antes de escribir (`CON-4`, `PUB-2`).

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Contrato informal en prosa (status quo) | No ejecutable; diverge entre repos y no bloquea publicaciones incorrectas. |
| Atelier dueño del contrato | El consumidor (Lumbre) debe fijar lo que acepta; invertir la propiedad reintroduce `R-LU-04`. |
| Un solo archivo de contrato compartido por submódulo | Acopla los despliegues; una copia fijada con hash es más simple y auditable. |
| Frontmatter con campos libres | `CON-3` exige lista permitida; los campos libres filtran datos privados a producción. |

## Consecuencias positivas

- Contrato **ejecutable** y verificable en CI (Lumbre F1) y antes de exportar (Atelier F3).
- Una sola fuente, una copia fijada con hash: se detecta cualquier divergencia.
- Fixtures compartidas permiten probar exportador y validador contra los mismos casos.

## Consecuencias negativas

- Cualquier campo nuevo obliga a coordinar ambos repos y subir `contract_version`.
- La copia fijada requiere un paso explícito (actualizar hash) al cambiar el contrato.

## Riesgos y evidencia que invalidaría la decisión

- Si en uso real aparece un caso que el v1 no representa sin inventar campos, se abre v2 con ADR.
- Si la copia fijada de Atelier se desincroniza en silencio, falla la comprobación de hash (evidencia de que el proceso se respetó).

## Implementación y migración / reversión

- Fuente: `lumbre-site/contract/v1/` (schemas + fixtures).
- Atelier: copia en `contracts/v1/` + `SHA256SUMS` + versión; validador headless que prueba las fixtures.
- Reversión: `v1` permanece aunque exista `v2`; los capítulos publicados declaran su `contract_version`.

## Decisiones relacionadas

- `ADR-INT-002` (estados y promoción) · `ADR-003` de Atelier (representación del texto) · validación en `LU-F1`.
