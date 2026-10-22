# SPEC-007: Shell editorial — tokens de diseño y layout accesible

- **Estado:** Aprobada (instrucción del propietario, 2026-10-22)
- **Nivel:** N1 (mini-SPEC)
- **Repo:** lumbre-site
- **Origen:** criterios `LU-F2-*` de `ROADMAP.md`; ciclo C2a de `docs/EXECUTION-PLAN.md`
- **Cubre:** `LU-F2-S2`, `LU-F2-S4`, `LU-F2-S5` (parcial), `A11Y-1`, `SEO-1` (base), `ARQ-2`
- **ADR relacionados:** `ADR-001` (Astro estático), `ADR-003` (URLs — las páginas reales llegan en C2b)
- **Reglas de AGENTS.md que aplican:** `ARQ-2`, `ARQ-3`, `PRI-2`, `SEO-1`, `A11Y-1`
- **Fecha / autor:** 2026-10-22 · agente, bajo instrucción del propietario

## ★ Problema

El sitio no tiene páginas, layout ni sistema visual: el build produce 0 páginas. Antes de construir las páginas de lectura (C2b) hace falta la base: tokens de diseño con contraste verificado, un layout global accesible y un presupuesto de rendimiento que las páginas de C2b no puedan romper.

## ★ Objetivos (medibles)

- Un layout global que renderiza al menos una página, navegable por teclado con foco visible, legible sin JavaScript (0 JS de cliente para la lectura).
- Tokens de color cuyos pares de uso cumplen WCAG 2.2 AA (texto ≥4.5:1, no-texto ≥3:1), verificados por script.
- Presupuesto de primera carga: ≤100 KB comprimido por página (HTML+CSS+fuentes; sin contar imágenes de contenido), 0 KB de JS de cliente, LCP objetivo ≤2.5 s en 4G lenta.

## ★ Alcance (C2a)

- `src/styles/tokens.css`: sistema de tokens (color, tipografía fluida, espaciado, radios) con valores aprobables.
- `src/features/reading/`: layout global `BaseLayout.astro` + `src/styles/global.css` (reset y estilos base del shell).
- `src/pages/index.astro`: página marcador mínima para ejercitar el layout (se reemplaza en C2b).
- `src/features/reading/a11y-tokens.ts` + script `test:a11y`: verifica contraste de los pares de tokens.
- Tipografía: Literata Variable autoalojada vía `@fontsource-variable/literata` (sin peticiones externas, `PRI-2`).

## ★ Fuera de alcance

- Páginas reales (inicio, catálogo, obra, capítulo, serial, sobre, privacidad): C2b con SPEC propia.
- Modo oscuro, búsqueda, preferencias de lectura: F4 (requieren evidencia de fricción).
- RSS/SEO técnico completo: C3. Comentarios/analítica: nunca en este shell (`ARQ-3`).

## Reglas de comportamiento

- HTML semántico: `header`/`nav`/`main`/`footer`, un solo `h1` por página, jerarquía válida.
- Enlace de salto al contenido principal; `:focus-visible` con anillo ≥3:1 sobre su entorno.
- `prefers-reduced-motion` respetado (el shell no introduce animación no solicitada por el usuario).
- `<html lang="es">`; toda página recibe `title` y `description` (slots de `SEO-1`; canonical/OG completos en C3).
- El shell no carga ningún script de cliente ni recursos de terceros.

## ★ Criterios de aceptación

- **CA-1** Dado el layout, cuando se navega con teclado, entonces el enlace de salto aparece al enfocar y todo elemento enfocable muestra anillo visible.
- **CA-2** Dado `pnpm test:a11y`, cuando se ejecuta, entonces los pares texto/fondo y acento/fondo ≥4.5:1 y anillo de foco ≥3:1 pasan; el script falla (exit ≠ 0) si un token incumple.
- **CA-3** Dado `pnpm build`, cuando termina, entonces genera ≥1 página HTML estática reproducible con 0 JS de cliente en el shell.
- **CA-4** Dado el CSS de tokens, cuando se revisa, entonces usa los nombres del contrato (`--color-*`, `--text-*`, `--space-*`) y `global.css`/layout no contienen valores de color literales fuera de tokens.
- **CA-5 (negativo)** El shell no incluye comentarios, analítica ni scripts externos (`ARQ-3`, `PRI-2`).

## Casos de error

Si `test:a11y` detecta contraste insuficiente, nombra el par de tokens, el valor medido y el mínimo exigido, y falla el comando (y con ello el CI).

## Riesgos

- La identidad visual puede derivar en genérica: mitigación — dirección de diseño documentada contra la checklist anti-plantilla (`docs/design/design-direction.md`).
- Fuente variable autoalojada añade peso: mitigación — presupuesto ≤100 KB y `font-display: swap`.

## Trazabilidad (se completa al implementar)

| Criterio | Prueba / verificación | PR / commit |
|---|---|---|
| CA-1 | Pendiente | Pendiente |
| CA-2 | Pendiente | Pendiente |
| CA-3 | Pendiente | Pendiente |
| CA-4 | Pendiente | Pendiente |
| CA-5 | Pendiente | Pendiente |
