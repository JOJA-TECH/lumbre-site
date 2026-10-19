# ADR-INT-003: Formato y cobertura de fixtures de publicación `PUB-3`

- **Estado:** Aceptado
- **Fecha:** 2026-10-15
- **Alcance:** Integración
- **Motivada por:** `SPEC-001` · `LU-F0-S2`, `LU-F0-S5`, `LU-F1-S1…S4`, `INT-1` · riesgo `R-LU-01`
- **Reglas de AGENTS.md afectadas:** `CON-2…CON-4`, `CON-5`, `PUB-3`
- **Revisar cuando:** cambie `PUB-3`, el contrato o el formato que Atelier puede validar de forma reproducible.

## Contexto

`contract/v1/fixtures/` contiene casos válidos para relato/serial y algunos negativos de schema, pero no cubre duplicados, fechas futuras, cuerpo Markdown vacío o roto ni patrones sensibles del cuerpo. `ADR-INT-001` establece fixtures compartidas y copia fijada con hash; no fija el formato para datos del cuerpo ni la cobertura completa de `PUB-3`.

## Decisión

Mantener los fixtures como datos sintéticos versionados junto al contrato v1, separados en dos grupos:

- `valid/` e `invalid/` en la raíz de `fixtures/`: lotes JSON de contrato que prueba el autotest actual de Atelier. Atelier y Lumbre deben aceptar/rechazar ambos con las mismas expectativas.
- `lumbre-only/valid/` y `lumbre-only/invalid/`: casos de validación editorial que el autotest actual de Atelier no recorre. Cada caso es un JSON autocontenido con id, regla esperada, publicación y cuerpos Markdown sintéticos asociados por índice de capítulo. Lumbre los consumirá en F1. No se pondrán en las carpetas raíz porque el autotest actual de Atelier los trataría como casos compartidos.

Cada fixture declara id, resultado y regla `PUB-3`; un README de la matriz mapea cada regla a su caso y al validador que hoy la ejecuta. Todo el paquete se copiará y verificará por SHA-256 en Atelier, pero una copia idéntica no se reportará como integración funcional para reglas que Atelier todavía no comprueba. No se cambian schemas ni semántica del contrato v1. `INT-1` permanece parcial hasta que la matriz y el hash se revisen en ambos repositorios y Atelier confirme o implemente las reglas adicionales acordadas.

## Alternativas consideradas

| Alternativa | Por qué se descarta |
|---|---|
| Añadir los casos del cuerpo como campos libres a `publicacion.schema.json` | Contradice el schema estricto y mezcla cuerpo con frontmatter/contrato. |
| Poner todos los casos inválidos en `fixtures/invalid/` | El autotest actual de Atelier los ejecutaría aunque aún no implemente varias de esas reglas y fallaría por razones legítimas. |
| Mantener únicamente casos JSON de schema | No ejercita las reglas de `PUB-3` que dependen del cuerpo o del lote. |
| Crear copias independientes en cada repositorio | Aumenta el riesgo `R-LU-04` de divergencia silenciosa. |

## Consecuencias positivas

- Se hace visible qué reglas se prueban en contrato, validador de lote y análisis de cuerpo.
- Se preserva la semántica del contrato v1 y se ofrece una colección común verificable.

## Consecuencias negativas

- Atelier y Lumbre deben coordinar la revisión del formato y actualizar el hash al cambiar los casos.
- La convención de archivos requiere documentación y herramientas de validación.

## Riesgos y evidencia que invalidaría la decisión

- Si Atelier no puede consumir el formato común de forma reproducible, se revisará la forma de compartir casos sin duplicar su fuente.
- Los detectores de prompts, IDs, rutas y claves pueden producir falsos positivos; se requieren casos revisados y criterios de rechazo explícitos.

## Implementación y migración / reversión

La instrucción del propietario «continua» aprobó `SPEC-001` y este ADR el 2026-10-15. Lumbre añadirá los casos sintéticos a la fuente del contrato, su matriz y hashes. Atelier permanece intacto en esta tarea; una sincronización desde Atelier/OpenCode será necesaria antes de declarar `INT-1` cerrado. La reversión elimina los casos nuevos y revierte su referencia de hash; no cambia el contrato ni contenido publicado.

## Decisiones relacionadas

`ADR-INT-001` (contrato v1) · `ADR-INT-002` (estados y promoción manual) · `SPEC-001`.
