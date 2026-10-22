# SPEC-008: Páginas de lectura — catálogo, obra, capítulo y navegación

- **Estado:** Aprobada (instrucción del propietario «ejecuta el siguiente ciclo», 2026-10-22)
- **Nivel:** N1 (mini-SPEC)
- **Repo:** lumbre-site
- **Origen:** criterios `LU-F2-*` de `ROADMAP.md`; ciclo C2b de `docs/EXECUTION-PLAN.md`
- **Cubre:** `LU-F2-S1`, `LU-F2-S3`, `LU-F2-S4`, `SEO-1`, `CON-5`, `ADR-003`
- **ADR relacionados:** `ADR-001`, `ADR-003`
- **Reglas de AGENTS.md que aplican:** `ARQ-2`, `ARQ-3`, `PRI-2`, `SEO-1`, `A11Y-1`, `CON-1`, `CON-2`
- **Fecha / autor:** 2026-10-22 · agente, bajo instrucción del propietario

## ★ Problema

Existe shell (tokens, layout) pero 0 páginas de lectura: un lector no puede llegar del inicio a un capítulo. Las colecciones ya validan el contrato v1, pero nada las renderiza.

## ★ Objetivos (medibles)

- Un lector recorre inicio → obra → capítulo → capítulo siguiente sin enlaces rotos (`LU-F2-S1`).
- Las URLs son exactamente las de `ADR-003`: `/obras/{work}/` y `/obras/{work}/{slug}/`.
- El build con 0 publicaciones sigue siendo válido (estado vacío legible, sin páginas rotas).

## ★ Alcance (C2b)

- `src/features/content/queries.ts`: consultas compartidas sobre colecciones (catálogo, orden, vecinos).
- **Inicio = catálogo** (`src/pages/index.astro`): lista de obras (relatos y seriales) con estado vacío.
- **Página de obra** (`/obras/{work}/`): título, autoría, sinopsis, etiquetas, lista de capítulos (por `order` en seriales).
- **Página de capítulo** (`/obras/{work}/{slug}/`): cuerpo renderizado, metadatos, navegación anterior/siguiente (solo seriales).
- **Sobre el proyecto** (`/sobre/`): qué es Lumbre, procedencia IA (texto aprobado, opción B), enlace a política editorial cuando se publique.
- Datos de prueba solo temporales y **nunca commiteados** (CON-1): la verificación del recorrido usa contenido sintético que se elimina tras el build.

## ★ Fuera de alcance

- Página pública de privacidad: la política está aprobada en texto pero **prohíbe publicarse** con identidad/contacto pendientes (F0). Se añadirá cuando existan los datos.
- Página de correcciones: sin contenido publicado no hay historial; llega con el primer contenido real.
- SEO técnico (canonical, OG, RSS): C3. Modo oscuro/ajustes: F4.

## Reglas de comportamiento

- `src/pages/` solo compone y enruta; la lógica de datos vive en `src/features/` (`ARQ-2`).
- Cada página: `title` + `description` propios, un solo `h1`, jerarquía válida (`SEO-1`, `A11Y-1`).
- Estados vacíos y metadatos usan solo tokens; 0 JS de cliente; sin comentarios/analítica (`ARQ-3`).
- Los slugs de URL provienen del frontmatter validado (`CON-5`); `uid` no se expone en URLs.

## ★ Criterios de aceptación

- **CA-1** Dado contenido sintético temporal (1 relato + 1 serial de 3 capítulos), cuando se construye y ejecuta `pnpm validate`, entonces todas las páginas se generan y ningún enlace interno queda roto (inicio → obra → capítulo → siguiente).
- **CA-2** Dado cualquier obra/capítulo, cuando se compila, entonces su URL es exactamente `/obras/{work}/` o `/obras/{work}/{slug}/`.
- **CA-3** Dado un serial, cuando se muestra su página de obra, entonces los capítulos aparecen ordenados por `order`; en un relato no aparece navegación anterior/siguiente.
- **CA-4** Dado el build sin `content/`, cuando termina, entonces genera inicio y `/sobre/` con estado vacío legible y sin errores.
- **CA-5** Dada cualquier página, cuando se revisa, entonces tiene `title` y `description`, un único `h1` y hereda el contraste AA de los tokens.
- **CA-6 (negativo)** Ninguna página añade JS de cliente, comentarios, analítica ni recursos de terceros; ninguna página pública expone la política de privacidad con datos pendientes.

## Casos de error

- Obra sin capítulos publicados: la página de obra muestra el estado vacío en lugar de una lista rota.
- Capítulo huérfano (obra inexistente): el build falla (validador + colecciones).

## Riesgos

- Verificación del recorrido con contenido sintético temporal: mitigación — contenido nunca commiteado y `pnpm validate` como comprobación; evidencia definitiva con el primer contenido real (`INT-3`).

## Trazabilidad (se completa al implementar)

| Criterio | Prueba / verificación | PR / commit |
|---|---|---|
| CA-1 | Build con contenido sintético temporal (1 relato + 1 serial de 3 capítulos, nunca commiteado): 8 páginas; `pnpm validate` 0 errores; recorrido inicio → obra → capítulo → siguiente verificado en `dist/` (Siguiente/Anterior correctos, relato sin nav); contenido eliminado tras la prueba | e8bb6c4 |
| CA-2 | URLs generadas exactamente `/obras/{work}/` y `/obras/{work}/{slug}/`; enlaces internos de cuerpos reescritos a esas URLs por `rehypeMdLinks` | 7aaaf86 |
| CA-3 | Serial ordenado 1→2→3 pese a archivos en orden inverso; relato sin navegación prev/next | e8bb6c4 |
| CA-4 | Build sin `content/`: genera `/` y `/sobre/` con estados vacíos legibles (2 páginas, 0 errores) | e8c59d1 |
| CA-5 | Cada página con `title`/`description` y un único `h1` (verificado en `dist/`); contraste AA heredado (`test:a11y` 9/9) | e8c59d1 |
| CA-6 | `grep` en `dist/`: 0 `<script>`, 0 recursos externos; sin página de privacidad pública | b13f1b4 |
