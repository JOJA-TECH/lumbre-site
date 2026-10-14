# ADR-INT-002: Estados editoriales vs. estados de despliegue; promoción manual

- **Estado:** Aceptado
- **Fecha:** 2026-10-13
- **Alcance:** Integración (Atelier → Lumbre)
- **Motivada por:** criterios `AT-F3-S1`, `AT-F3-S4`, `LU-F0-S1`, `LU-F1-S1` · hitos `INT-2`, `INT-3`
- **Reglas afectadas:** `PUB-1`, `PUB-2`, `PUB-4` (Atelier) · `CON-1`, `CON-2`, `PUB-1` (Lumbre)
- **Revisar cuando:** se automatice cualquier paso hacia producción, o si un incidente demuestra que el flujo permite publicar algo no aprobado.

## Contexto

Un capítulo atraviesa estados **editoriales** en Atelier (p. ej. `borrador`, `buffer`, `aprobado`) y estados de **despliegue** en Lumbre (staging vs producción). Confundirlos es el riesgo `R-AT-02`: publicar contenido incorrecto desde Atelier. La producción de Lumbre solo acepta `status: publicado` (`CON-2`).

## Decisión

Se **separan** ambos conceptos y la promoción a producción es **manual y revisada**.

- **Estados editoriales (Atelier):** controlan qué puede exportarse. `borrador` y `buffer` **bloquean** la exportación (`AT-F3-S1`).
- **Estados de despliegue (Lumbre):** `staging` y `producción`. Producción solo acepta `status: publicado`; cualquier otro estado hace fallar el build.
- **Promoción manual:** Atelier deja el export en **staging** y el diff visible. Ningún agente empuja a producción (`PUB-4`, `PUB-1` de Lumbre); la persona revisa y promueve.
- **Aprobación explícita por capítulo** antes de exportar (`AT-F3-S1`).

Detalles verificables:

- Un capítulo sin aprobación explícita no se incluye en el manifiesto de exportación.
- El export a staging se valida contra el contrato **antes** de escribirse (`PUB-2`, `CON-4`); si el frontmatter es inválido, aborta.
- La puerta `AT-G-B`/`LU-G-A` bloquea cualquier automatización si el flujo puede exponer borradores o prompts.

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| Un único estado (publicar directo desde Atelier) | Elimina la revisión humana; es exactamente `R-AT-02`. |
| Auto-merge a producción si el validador pasa | Un validador correcto no captura "este capítulo no debía publicarse"; la decisión editorial es humana. |
| Estado editorial reutilizado como estado de despliegue | Acopla dos ciclos con dueños distintos; genera ambigüedad sobre qué significa "aprobado". |

## Consecuencias positivas

- Ningún contenido no aprobado llega a producción por accidente.
- El diff en staging da revisión real antes de promover.
- Atelier y Lumbre pueden evolucionar sus estados sin romper al otro.

## Consecuencias negativas

- La publicación exige un paso humano manual (coste intencional).
- Hay que mantener un mapeo documentado entre estados editoriales y de despliegue.

## Riesgos y evidencia que invalidaría la decisión

- Si el volumen de publicación hace insostenible la promoción manual, se evalúa automatización **parcial** en staging, nunca directa a producción.
- Si aparece un camino que permita publicar sin revisión, es un defecto a corregir y evidencia de que esta decisión importa.

## Implementación y migración / reversión

- Atelier (F3): manifiesto de exportación con solo capítulos aprobados + validación previa + salida a staging.
- Lumbre (F1): `CON-2` hace fallar el build ante estados no publicables; CI ejecuta la validación.
- Reversión: revertir un capítulo es un `git revert` de su cambio (`PUB-2` de Lumbre).

## Decisiones relacionadas

- `ADR-INT-001` (contrato) · riesgos `R-AT-02`, `R-LU-01` · puertas `AT-G-B`, `LU-G-A`.
