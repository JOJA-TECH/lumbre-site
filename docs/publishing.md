# Publicación segura

Procedimiento operativo para publicar y revertir contenido en Lumbre. Desarrolla el flujo de `AGENTS.md` §6 y las reglas `PUB-1…PUB-3`. Las decisiones de las puertas `LU-G-A` (¿la publicación es segura?) y `LU-G-B` (¿la lectura es sólida?) aplican en todo momento: si el build permite que un borrador llegue a producción, no se añade automatización.

## Flujo de publicación

```text
exportación de Atelier
→ rama/PR de staging
→ CI (test:contract · validate · check · build)
→ revisión humana del diff
→ merge a main
→ promoción manual a producción
→ verificación posterior
```

1. **Exportación de Atelier.** El export sale de Atelier tras su propia validación (`CON-4`, doble validación). Lumbre no recibe manuscritos privados, prompts, claves ni datos de generación (`CON-1`).
2. **Rama/PR de staging.** El contenido entra a `content/` únicamente por PR. Nunca por push directo a `main`.
3. **CI.** Cada PR ejecuta validación de contrato (`pnpm test:contract`), validador de contenido (`pnpm validate`), comprobación de tipos (`pnpm check`) y build (`pnpm build`). El build falla ante cualquier condición de `PUB-3`: frontmatter inválido o con campos desconocidos (`CON-3`), slug duplicado (`CON-5`), serial sin `order` o con órdenes repetidos, fecha inválida o futura, estado no publicable (`CON-2`), contenido vacío, enlaces internos rotos o campo privado.
4. **Revisión humana del diff.** Una persona revisa el diff completo del PR: qué capítulos entran, qué cambian, qué estados tienen.
5. **Merge a `main`.** `main` es la fuente de producción. El merge solo ocurre con CI en verde y revisión humana.
6. **Promoción manual a producción.** El despliegue **nunca es automático** ni forma parte del CI (`ADR-INT-002`, `ADR-002`): la promoción de una versión aprobada es una acción humana explícita sobre el hosting (`SPEC-004`).
7. **Verificación posterior.** Tras cada publicación se comprueban: URLs de las páginas nuevas o modificadas, canonical y metadatos; RSS y sitemap en cuanto existan (F3, `ARQ-5`).

Un agente **no** pushea a `main` cambios que publican o modifican una historia (`PUB-1`): prepara el PR, deja el diff visible y espera revisión humana.

## Reversión por capítulo (`PUB-2`)

Para retirar o deshacer un capítulo publicado:

1. Identificar el commit que introdujo ese capítulo (o su última corrección).
2. Ejecutar `git revert` de ese commit concreto. **No** altera otros capítulos ni reescribe historial.
3. Abrir el PR resultante con el mismo flujo de publicación: CI, revisión del diff, merge a `main`, promoción manual.
4. Verificación posterior: la URL del capítulo retirado y las de los demás capítulos de la obra siguen respondiendo correctamente (los slugs y URLs de otros capítulos no cambian, `CON-5`).

> **Nota:** la prueba real de reversión (`LU-F1-S5`) se ejecutará con el primer contenido real (hito `INT-2`), porque `content/` aún no existe. Hasta entonces este procedimiento está documentado pero sin evidencia práctica.

## Trazabilidad

- Criterios: `LU-F1-S1…S4` (validador), `LU-F1-S5` (reversión), `LU-F1-S6` / `INT-2` (primer export real).
- Decisiones: `ADR-INT-002` (estados editoriales vs. despliegue, promoción manual), `ADR-002` (hosting y previews), `ADR-003` (URLs y redirecciones).
- Especificaciones: `SPEC-006` (validador y CI), `SPEC-001` (matriz de fixtures `PUB-3`).
