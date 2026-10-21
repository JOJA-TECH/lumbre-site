# EXECUTION PLAN — Lumbre

> Plan de ejecución por ciclos de las fases del [`ROADMAP.md`](../ROADMAP.md) (fuente de verdad de QUÉ y criterios de salida; este doc define CÓMO se ejecuta).
> Creado: 2026-10-21 · Estado del plan: propuesto, pendiente de aprobación del propietario.
> Cada ciclo que toca comportamiento requiere su SPEC (mini para N1) aprobada ANTES de codificar (AGENTS §3/§4).

## 0. Protocolo estándar de ciclo (se repite en todos)

1. **Spec** — redactar/actualizar SPEC del incremento con criterios `CA-n`; el propietario la aprueba.
2. **Explore** — subagente `explore` mapea el código/contenido afectado y lista todo lo que el cambio toca (llamadores, tests, fixtures).
3. **Build en paralelo** — subagentes `general` ejecutan rebanadas independientes en paralelo (una por feature/sistema); yo integro y resuelvo conflictos.
4. **Verify** — `pnpm check` · `pnpm build` · validador de contenido (desde C1) · pruebas del ciclo · revisión del diff.
5. **Record** — actualizar SPEC/ADR, `docs/INDEX.md`, changelog y este plan.
6. **Commit** — lotes lógicos al final del ciclo, mensajes **en inglés** con conventional commits, citando el ID de SPEC (`§9` AGENTS). Un PR por ciclo; nada se pushea a producción por un agente (**PUB-1**).

**Commits — convención:**
```text
<type>(<scope>): <imperative summary> (SPEC-NNN)
types: feat | fix | docs | test | chore | ci | build | refactor
un lote = un área coherente; nunca mezclar feat + docs + ci en un commit
```

**Skills disponibles por ciclo:** `ux-researcher-designer` (personas/journeys/usabilidad) · `ui-design-system` (tokens, WCAG, responsive) · `frontend-design` (identidad visual, anti-genérico).

## 1. Mapa de ciclos

| Ciclo | Fase ROADMAP | Entregable central | Skills | Bloqueos/gates humanos |
|---|---|---|---|---|
| **C0** | F0 (cierre) | Docs, políticas, fixtures `INT-1` | — | Datos de políticas, checkout Atelier, dominio provisional |
| **C1** | F1 | Validador CLI + CI + flujo PR/reversión | — | Aprobación SPEC-006 (CI = GitHub Actions) |
| **C2a** | F2 (base) | Tokens de diseño + layout global + accesibilidad | ux-researcher, ui-design-system, frontend-design | Aprobación SPEC-007 (presupuesto rendimiento + WCAG AA) |
| **C2b** | F2 (páginas) | Inicio, catálogo, relato, serial, navegación, editoriales | frontend-design, ui-design-system | Contenido aprobado para poblar `content/` |
| **C3** | F3 | RSS, sitemap, SEO técnico, 404, redirecciones | frontend-design (404) | Aprobación SPEC-008 |
| **C4** | F4 | Solo con fricción observada: una SPEC por mejora | según mejora | Evidencia documentada (regla §5.3 ROADMAP) |
| — | C1–C4 condicionadas | **No se planifican** hasta abrir sus puertas `LU-G-C/D` | — | — |

## 2. Ciclo C0 — Cierre F0 *(docs/contrato, N0/N1)*

**Objetivo:** liquidar las brechas de F0 (`LU-F0-S5/INT-1` parcial, políticas, contradicción de INDEX).

- **Agentes:** 1 `explore` (auditar consistencia docs/INDEX vs SPECs/ADRs) + 1 `general` (redactar políticas en paralelo).
- **Verify:** revisión humana de cada doc; `pnpm check && pnpm build` intactos.
- **Lotes de commit:**
  ```text
  docs(index): resolve SPEC-001/ADR-INT-003 status contradiction
  docs(policies): draft editorial and privacy policies (SPEC-001)
  docs(roadmap): add provisional name and candidate domain proposal
  chore(contract): mirror lumbre-only fixtures and refresh SHA256SUMS (INT-1)
  ```
- **Gate:** sincronización con Atelier requiere su checkout (no editarlo desde aquí); dominio y datos de contacto los aporta el propietario. `INT-1` solo se cierra cuando Atelier confirme hash y cobertura.

## 3. Ciclo C1 — Validación y publicación segura *(F1)*

**Objetivo:** que un borrador/dato inválido **haga fallar el build** (`LU-F1-S1…S6`, `PUB-3`).

- **SPEC-006 (entrada del ciclo):** validador CLI + integración Content Collections + CI. Cubre `LU-F1-*`; sin ADR nuevo (aplica reglas existentes).
- **Agentes:** 1 `explore` (mapear reglas `PUB-3` ↔ fixtures de `contract/v1/`) + 2 `general` en paralelo: (a) validador `src/features/validation/` con script `pnpm validate`; (b) workflow CI + procedimiento de reversión.
- **Alcance técnico:** validador Node sin dependencias nuevas (lee JSON Schema + Markdown); gancho en build para que colecciones fallen con frontmatter inválido, slug duplicado, `order` repetido/ausente, fecha inválida/futura, estado no publicable, cuerpo vacío, enlaces internos rotos, prompts/IDs internos/rutas locales/claves. Reversión = `git revert` por capítulo (prueba `PUB-2`).
- **Verify:** cada fixture `valid/` pasa, cada `invalid/` y `lumbre-only/invalid/` falla con mensaje que nombra la regla; CI en verde; prueba de reversión documentada.
- **Lotes de commit:**
  ```text
  feat(validation): add content validator enforcing PUB-3 rules (SPEC-006)
  test(validation): cover contract fixture matrix (valid, invalid, lumbre-only)
  build(content): fail build on invalid or non-public frontmatter (SPEC-006)
  ci: run validate, astro check and build on pull requests (SPEC-006)
  docs: document staging PR flow and per-chapter revert procedure (PUB-2)
  ```
- **Gate:** aprobación de SPEC-006 y de GitHub Actions como CI (proveedor externo — PRI/§10: se declara, no añade scripts en páginas de lectura).

## 4. Ciclo C2a — Base visual y accesibilidad *(F2, parte 1)*

**Objetivo:** sistema de diseño + layout global listos para las páginas (`LU-F2-S2/S4/S5`).

- **SPEC-007 (entrada):** shell editorial — presupuesto de rendimiento, objetivo WCAG 2.2 AA, estructura `src/features/{reading,catalog,serials,editorial,navigation,privacy}/` (`ARQ-2`).
- **Skills (uso explícito):** `ux-researcher-designer` → persona lectora + journey lectura (insumo de SPEC-007); `ui-design-system` → tokens (color/espaciado/tipografía fluida `clamp()`), verificación contraste AA; `frontend-design` → identidad visual propia, evita plantilla genérica.
- **Agentes:** 1 `general` para tokens+layout; revisión integrada por mí contra las 3 skills.
- **Verify:** `pnpm check && pnpm build` · contraste ≥4.5:1 en pares token · foco visible y navegación por teclado en layout · sin JS requerido.
- **Lotes de commit:**
  ```text
  feat(reading): add design tokens meeting WCAG AA (SPEC-007)
  feat(reading): add global layout with keyboard-visible focus (SPEC-007)
  test(a11y): verify contrast, focus and reduced motion on layout (SPEC-007)
  ```
- **Gate:** aprobación de SPEC-007 por el propietario (define presupuesto y AA).

## 5. Ciclo C2b — Páginas y navegación de lectura *(F2, parte 2)*

**Objetivo:** `LU-F2-S1/S3` — leer inicio → obra → capítulo → siguiente sin enlaces rotos.

- **Agentes:** 3–4 `general` en paralelo, una rebanada por feature: (a) `catalog` inicio+catálogo, (b) `reading` página capítulo, (c) `serials` índice con `order`, (d) `navigation` anterior/siguiente + `editorial/privacy` páginas. Integración y resolución de conflictos por mí.
- **URLs:** exactamente `ADR-003` — `/obras/{work}/` y `/obras/{work}/{slug}/`. Sin comentarios/analítica (`ARQ-3`, ni carpetas).
- **Verify:** build genera HTML estático reproducible; rutas con metadatos (SEO-1 mínimo); recorrido completo con contenido de prueba **en staging**, no en `content/` (CON-1: solo contenido aprobado entra ahí); responsive móvil/escritorio.
- **Lotes de commit:**
  ```text
  feat(catalog): add home and works catalog pages (SPEC-007)
  feat(reading): add chapter page with typographic reading mode (SPEC-007)
  feat(serials): add serial index ordered by chapter order (SPEC-007)
  feat(navigation): add prev/next chapter links (SPEC-007)
  feat(editorial): add about, privacy and corrections pages (SPEC-007)
  test(e2e): verify full reading path without broken links (LU-F2-S1)
  ```
- **Gate:** contenido real aprobado por el propietario antes de cualquier merge que publique (PUB-1); la primera publicación real es `INT-3` y pasa por `LU-G-L`.

## 6. Ciclo C3 — RSS, sitemap y SEO técnico *(F3)*

**Objetivo:** `LU-F3-S1…S5` — descubribilidad sin romper lectura.

- **SPEC-008 (entrada):** alcance de feeds, canónicas, redirecciones (cierra lo dejado por `ADR-003` para F3).
- **Agentes:** 2 `general` paralelos: (a) RSS global/por serial + sitemap desde las mismas colecciones validadas (`ARQ-5`), (b) canonical/OG/robots/404 + `_redirects` en config aislada (`ARQ-4`).
- **Verify:** feed excluye no-`publicado`; entradas con fecha/título/enlace/descripción válidos; sitemap solo URLs públicas; cambio de slug → 301 probado con fixture (`INT-4` en vacío, real después).
- **Lotes de commit:**
  ```text
  feat(rss): add global and per-serial feeds from validated collections (SPEC-008)
  feat(seo): add sitemap, robots, canonical and Open Graph metadata (SPEC-008)
  feat(errors): add custom 404 page (SPEC-008)
  feat(hosting): add redirects config isolated from site logic (ADR-004)
  test(feed): verify draft exclusion and entry metadata (LU-F3-S1/S2)
  ```

## 7. Ciclo C4 — Mejoras F4 *(solo con evidencia)*

Nada se agenda. Cada candidata (búsqueda local, filtros, ToC de serial, progreso local, modo oscuro, tamaño de fuente, changelog) exige SPEC con **fricción observada documentada** (regla §5.3 del ROADMAP) y respeta `LU-F4-S1…S3`. Skills a invocar según la mejora (`frontend-design` para modo oscuro/tipografía, `ux-researcher-designer` para priorizar por fricción).

## 8. Reglas transversales

- **Trazabilidad:** todo commit cita su SPEC; `docs/INDEX.md` se actualiza en el mismo ciclo (`§9`).
- **Nada de:** comentarios/analítica/monetización (C1/C2/C4 condicionadas), datos del lector, dependencias de hosting en el código del sitio (`ARQ-4`), contenido no aprobado en `content/` (CON-1).
- **Paradas obligatorias (§10 AGENTS):** nuevo proveedor externo, cambio de URLs públicas, contrato v2 → requiere decisión humana antes de ejecutar el ciclo afectado.
- **DoD por ciclo (§11):** SPEC aprobada · CA con prueba · ADR al día · build/pruebas en verde · diff revisado · INDEX/changelog actualizados.
