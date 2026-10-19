# SPEC-001: Cierre de evidencia F0 y cobertura de fixtures `PUB-3`

- **Estado:** Aprobada
- **Nivel:** N2
- **Repo:** lumbre-site (coordinación con deepwrite-atelier para `INT-1`)
- **Origen:** criterios de `ROADMAP.md`; revisión del repositorio 2026-10-15
- **Cubre:** `LU-F0-S1…S5`, `LU-F1-S1…S4`, `INT-1`
- **ADR relacionados:** `ADR-INT-001`, `ADR-INT-002`, `ADR-INT-003` (propuesto)
- **Reglas de AGENTS.md que aplican:** `CON-2…CON-4`, `CON-5`, `PUB-3`
- **Fecha / autor:** 2026-10-15 · aprobada por la instrucción del propietario «continua»

## Problema

El repositorio contiene schemas y fixtures iniciales, pero no cubre en fixtures todas las condiciones de `PUB-3` y no hay evidencia local de varias salidas de F0. Sin estos casos, Atelier y Lumbre no pueden comprobar con la misma colección qué publicaciones debe aceptar o rechazar cada validador.

## Usuario y flujo afectado

La persona que revisa un export de Atelier y quienes mantienen los validadores de Lumbre y Atelier.

## Objetivos (medibles)

- Cada regla automatizable de `PUB-3` tiene al menos un caso válido o inválido identificable y una expectativa explícita.
- El conjunto compartido de reglas de esquema sigue siendo compatible con el autotest actual de Atelier; los casos no soportados se separan como Lumbre-only y se registran como brecha de integración.
- La colección completa de fixtures se fija por versión y hash en Atelier sin modificar la semántica del contrato v1.

## Alcance

- Definir formato, nombres y expectativas de fixtures para reglas de schema y validación de publicación, incluidas las condiciones del cuerpo Markdown; separar fixtures compartidas de las reglas que el validador actual de Atelier aún no ejecuta.
- Cubrir estados no publicables, campos obligatorios/desconocidos, slug duplicado, `order` ausente/repetido, fecha inválida/futura, cuerpo vacío, enlace interno roto y patrones de prompt, ID interno, ruta local o clave.
- Registrar evidencia de F0, `INT-1` y dependencias externas en `docs/INDEX.md` y `ROADMAP.md`.

## Fuera de alcance

- Cambiar campos o semántica del contrato v1, schemas, URLs o estrategia de hosting.
- Implementar el CLI, Content Collections, CI, build, exportador de Atelier o publicación a producción.
- Declarar `INT-1` cumplido sin verificar el repositorio Atelier y la revisión humana de su hash/fixtures.

## Reglas de comportamiento

- Cada fixture declara el resultado esperado y la regla de `PUB-3` que ejercita.
- Los dos validadores consumen las fixtures compartidas y deben aceptar los válidos y rechazar los inválidos. Lumbre F1 consumirá además las fixtures Lumbre-only para reglas que el validador actual de Atelier no cubre; esas reglas solo pasan a compartidas después de implementar y probar el mismo comportamiento en Atelier.
- Una fixture inválida debe aislar una regla cuando sea viable; los casos con varias fallas explican cuál falla se pretende detectar.
- Los casos que requieren el cuerpo de una pieza incluyen Markdown sintético y nunca material editorial real.

## Contratos y datos afectados

La SPEC no propone cambiar JSON Schema ni la versión 1 del contrato. Define datos de prueba bajo `contract/v1/fixtures/`; por ello la ubicación y el formato exacto requieren `ADR-INT-003` aceptado antes de implementar.

## Criterios de aceptación

- **CA-1** Cada condición enumerada de `PUB-3` está asociada a uno o más fixtures, con formato y resultado esperado documentados.
- **CA-2** Hay al menos un lote válido de relato y uno de serial con tres o más capítulos, además de casos negativos para reglas no cubiertas por schemas.
- **CA-3** Los casos de cuerpo Markdown son sintéticos, no contienen secretos reales y distinguen cuerpo vacío, enlace interno roto, prompt, ID interno y ruta local.
- **CA-4** Se documenta un procedimiento reproducible para verificar que Lumbre y Atelier usan la misma versión/hash del paquete; la matriz declara cuáles fixtures prueba cada validador y qué reglas aún requieren sincronización de comportamiento.
- **CA-5** `docs/INDEX.md` y `ROADMAP.md` enlazan cada criterio a evidencia; criterios sin evidencia permanecen parciales o pendientes.
- **CA-6 (negativo)** No se cambia `contract_version`, schemas, datos de `content/`, ni se marca `INT-1` cumplido sin evidencia de Atelier.

## Casos de error

Fixture sin expectativa, no parseable o que falla por una regla distinta a la declarada: la verificación de fixtures debe fallar y mostrar el identificador del caso y la regla esperada.

## Riesgos y evidencia que los invalidaría

- **Riesgo:** un formato de fixtures personalizado no puede consumirse en Atelier. Se invalida si el validador de Atelier no puede ejecutar la colección sin transformaciones no reproducibles.
- **Riesgo:** los detectores de texto marcan falsos positivos. Se revisan casos de falsos positivos antes de establecer patrones de rechazo.

## Preguntas abiertas

| Pregunta | Quién responde | ¿Bloquea? |
|---|---|---|
| ¿Cuándo puede Atelier implementar y probar las reglas adicionales para convertir fixtures Lumbre-only en comportamiento compartido? | Mantenedor/a de Atelier | Sí, para cerrar `INT-1` |
| ¿Qué formato de caso admite el futuro CLI para combinar frontmatter y cuerpo Markdown? | Resuelto: caso JSON autocontenido, esperado, regla, publicación y cuerpos Markdown por slug | No |

## Trazabilidad (se completa al implementar)

| Criterio | Prueba / verificación | PR / commit |
|---|---|---|
| CA-1 | `contract/v1/fixtures/lumbre-only/README.md` asigna cada regla a un caso, expectativa y alcance de validador; los casos raíz existentes cubren forma de schema. | — |
| CA-2 | Lote válido de relato en `fixtures/valid/relato.json`; serial de tres capítulos en `fixtures/valid/serial.json` y versión con cuerpos en `lumbre-only/valid/serial-tres-capitulos.json`. | — |
| CA-3 | Casos sintéticos separados para cuerpo vacío, enlace roto, prompt, ID interno, ruta local y patrón de clave bajo `lumbre-only/invalid/`. | — |
| CA-4 | El README de contrato y la matriz documentan copia exacta y recalculo de SHA-256 en Atelier. | — |
| CA-5 | `docs/INDEX.md` registra esta SPEC y `ROADMAP.md` conserva `LU-F0-S5/INT-1` parcial hasta sincronizar y revisar cobertura. | — |
| CA-6 | Schemas y contenido de producción sin cambios; Atelier no se modificó. | — |

## Pendientes y limitaciones registradas

- Esta SPEC autoriza los cambios de fixtures descritos en `contract/` junto con `ADR-INT-003`; no autoriza cambiar schemas, semántica, contenido editorial ni el repositorio Atelier.
- Framework, hosting y estrategia operativa de URLs siguen como decisiones de F0 independientes.
