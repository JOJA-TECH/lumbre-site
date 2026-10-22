# PROJECT INDEX — Lumbre (`lumbre-site`)

> Resumen persistente del proyecto para orientación rápida de humanos y agentes.
> **Fuente de verdad:** [`ROADMAP.md`](../ROADMAP.md) (fases, criterios, hitos) y [`AGENTS.md`](../AGENTS.md) (reglas).
> Generado: 2026-10-21 · Regenerar snapshot del repo: `pnpm dlx repomix` (salida en `repomix-output.xml`, ignorada por Git).

## 1. Arquitectura

Sitio editorial **estático** para leer relatos y novelas serializadas exportadas desde *deepwrite-atelier*.

- **Astro 7** en `output: 'static'` + **Content Collections** de build-time (`ADR-001`). Sin SSR ni backend (`ARQ-1`); pasar a dinámico exige ADR + Puerta `LU-G-D`.
- **Contrato de contenido v1** como JSON Schema estricto en `contract/` (Lumbre es su dueño, `ADR-INT-001`); los schemas de Astro lo replican con Zod `.strict()` (campo desconocido = error, `CON-3`).
- **Hosting:** Cloudflare Workers Static Assets (`ADR-002`); `dist/` portable y agnóstico al proveedor (`ADR-004`); `wrangler.jsonc` es el único adaptador de despliegue.
- **URLs** fijadas: `/obras/{work}/` y `/obras/{work}/{slug}/`, con `uid` estable para redirecciones (`ADR-003`).
- Stack: Node ≥22.12, pnpm 12.11.2, TypeScript 6.0.3 (fijado porque `astro check` no acepta TS 7). Sin `content/` aún: 0 páginas publicadas, propio de F0.

## 2. Módulos

| Ruta | Rol | Estado |
|---|---|---|
| `src/features/content/` | Único feature: colecciones (`collections.ts`) y schemas Zod derivados del contrato (`schemas.ts`) | Verificado (SPEC-005) |
| `src/features/reading/` | Layout global accesible (`BaseLayout`) y verificador de contraste (`a11y-tokens.ts`) | Verificado (SPEC-007) |
| `src/styles/` | Tokens de diseño «Papel frío, tinta y brasa» (WCAG AA, Literata autoalojada) y CSS base del shell | Verificado (SPEC-007) |
| `src/features/validation/` | Validador CLI de reglas `PUB-3` (`pnpm validate` / `pnpm test:contract`, 17/17 fixtures); reutiliza los schemas Zod | Verificado (SPEC-006) |
| `src/content.config.ts` | Punto de entrada de Content Collections; solo reexporta | Verificado |
| `contract/v1/` | Fuente del contrato: `obra`, `capitulo`, `publicacion` (JSON Schema) + fixtures `valid/`, `invalid/`, `lumbre-only/` y `SHA256SUMS` | Aceptado; copia Atelier pendiente de sincronizar |
| `content/` | Contenido aprobado (Markdown + frontmatter). **Aún no existe** | Vacío por diseño |
| `docs/specs/` `docs/decisions/` | SPEC-001…005 (aprobadas; 005 verificada), ADR-001…004 e INT-001…003 (aceptados) | Sin PRs registrados aún |
| `docs/policies/` | `editorial.md` y `privacidad.md` — **borradores, no publicar** | Pendiente aprobación y datos reales |
| `wrangler.jsonc` | Config de Workers: assets desde `./dist` | Aislado del sitio (`ARQ-4`) |

## 3. Flujo de datos

```text
Atelier (escritura, estados borrador/buffer/aprobado — ADR-INT-002)
  → export Markdown + frontmatter v1  →  PR / rama staging en lumbre-site
  → validación (schema estricto, reglas PUB-3; hoy: Zod en build; F1: validador CLI + CI)
  → revisión humana del diff  →  merge a main  →  astro build → dist/ estático
  → Cloudflare Workers Static Assets (preview por PR; promoción manual, nunca automática)
```

- Lumbre **no recibe** datos privados de Atelier: solo capítulos con `status: publicado` (`CON-1/2`), sin prompts, IDs internos ni rutas locales (detectados por fixtures `lumbre-only/`).
- El contrato fluye en sentido inverso: `contract/` de Lumbre se copia a Atelier fijado por `SHA256SUMS` (hito `INT-1`, parcial).

## 4. Estado y tareas pendientes (según ROADMAP §6 y registro de cambios)

**Fase activa: F2 — C2a ejecutado.** Shell editorial listo: tokens WCAG AA verificados por script, layout global accesible con 0 JS, dirección de diseño documentada. Sigue C2b (páginas reales). F1 verificada localmente (SPEC-006, 17/17 fixtures); `LU-F1-S5/S6` esperan contenido real. Ejecución por ciclos: [`docs/EXECUTION-PLAN.md`](EXECUTION-PLAN.md).

| # | Tarea | Fase / criterio |
|---|---|---|
| 1 | Sincronizar fixtures `lumbre-only` con Atelier y acordar cobertura de su autotest — manifiesto local verificado en C0 (21/21 hashes ok) | F0 · `LU-F0-S5` / `INT-1` (parcial) |
| 2 | ~~Cerrar políticas~~ — texto aprobado 2026-10-21; falta identidad/contacto del responsable para publicar | F0 · entregables |
| 3 | ~~Resolver contradicción en `docs/INDEX.md`~~ — resuelto en C0 | F0 · trazabilidad |
| 4 | ~~Documentar nombre provisional y dominio candidato~~ — creado `docs/name-and-domain.md`; verificación real diferida a `LU-G-L` | F0 · entregable |
| 5 | ~~Validador + CI (F1)~~ — `SPEC-006` verificada: validador 17/17 fixtures, CI definido; `LU-F1-S1…S4` verificados localmente | F1 · `LU-F1-S1…S4` |
| 6 | Shell editorial y lectura (layouts, catálogo, capítulo, navegación) en `src/features/{reading,catalog,serials,editorial,navigation,privacy}/` | F2 · `LU-F2-S1…S5` |
| 7 | RSS, sitemap, SEO técnico, 404, redirecciones | F3 · `LU-F3-S1…S5`, `INT-4` |
| 8 | Puertas `LU-G-L` antes de lanzar: dominio (`H-LU-03`), cuenta/límites Cloudflare (`H-LU-02`), publicación real `INT-3` | Lanzamiento |

**No planificar** (condicionadas, requieren puerta): C1 comentarios, C2 analítica, C3 Nivel 2 (`LU-G-C`/`LU-G-D`), C4 publicidad (`H-LU-04`, revisión tras F2). Fuera de alcance: §10 del ROADMAP (cuentas, pagos, multi-autor…).
