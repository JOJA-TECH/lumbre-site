# SPEC-006: Validador de publicación segura y CI

- **Estado:** Aprobada (instrucción del propietario «continua» de 2026-10-21, mismo precedente que `SPEC-001`)
- **Nivel:** N1 (mini-SPEC)
- **Repo:** lumbre-site
- **Origen:** criterios `LU-F1-*` de `ROADMAP.md`
- **Cubre:** `LU-F1-S1…S4`, `INT-2` (parcial)
- **ADR relacionados:** `ADR-INT-001`, `ADR-INT-002` (aceptados), `ADR-002`, `ADR-004` (aceptados)
- **Reglas de AGENTS.md que aplican:** `PUB-1…PUB-3`, `CON-2…CON-4`, `ARQ-1`, `ARQ-4`
- **Fecha / autor:** 2026-10-21 · agente, bajo instrucción del propietario

## ★ Problema

Hoy solo el schema zod del build falla ante frontmatter inválido: no hay validador de reglas cruzadas (slugs y `order` duplicados, fechas futuras, filtraciones en cuerpos), ni CI que ejecute validación y build en cada PR, ni flujo de publicación documentado. Sin esto, el riesgo principal del roadmap (`R-LU-01`: que un borrador o metadato interno llegue a producción) no está cubierto por pruebas automáticas.

## ★ Objetivos (medibles)

- Toda fixture inválida de la matriz (`contract/v1/fixtures/`) hace fallar la validación nombrando su regla.
- CI ejecuta validación + check + build en cada PR.
- El procedimiento de reversión por capítulo está documentado y se prueba con el primer contenido real.

## ★ Alcance

- Validador CLI en `src/features/validation/` que reutiliza los schemas zod de Content Collections (única fuente de verdad del esquema).
- Scripts `validate` y `test:contract` en `package.json`.
- Workflow de CI en GitHub Actions (proveedor externo de CI declarado; no carga scripts en las páginas de lectura, `PRI-2` intacto).
- `docs/publishing.md`: flujo de publicación y reversión.

## ★ Fuera de alcance

- Validación en Atelier (su propio repositorio, `CON-4` por su lado).
- Despliegue automático: la promoción a producción es manual (`ADR-INT-002`, `ADR-002`).
- Detección heurística avanzada más allá de la matriz de fixtures (se amplía en futuros ciclos).
- `LU-F1-S5` / `S6`: requieren contenido y export de Atelier reales (`INT-2`).

## ★ Criterios de aceptación

- **CA-1** Dada la matriz completa de fixtures (`contract/v1/fixtures/`), cuando se ejecuta `pnpm test:contract` y `pnpm validate`, entonces cada fixture inválida falla y la salida nombra el archivo y la regla `PUB-3` correspondiente; cada fixture válida pasa.
- **CA-2** Dado un PR cualquiera, cuando GitHub Actions lo ejecuta, entonces los pasos `test:contract`, `validate`, `check` y `build` corren y el PR queda verde o rojo según su resultado.
- **CA-3** Dado un repositorio con `content/` vacío, cuando se ejecuta `pnpm validate`, entonces termina con exit 0 (vacío es válido; no hay nada que publicar).
- **CA-4** Dado el validador, cuando se revisa su implementación, entonces reutiliza los schemas zod de Content Collections sin duplicar definiciones de campos (única fuente de verdad del schema, `CON-4`).
- **CA-5 (negativo)** El validador no publica ni despliega nada y no envía contenido a ningún servicio externo (`PRI-1`): solo lee `content/` y `contract/` y escribe en la salida local.

## Casos de error

Ante cualquier fixture inválida o contenido que viole `PUB-3`, la salida del validador nombra el archivo y la regla incumplida (p. ej. `content/mi-obra/cap-2.md: slug duplicado — PUB-3`), y termina con exit distinto de 0, lo que detiene el CI.

## Riesgos

- Los patrones de filtración (prompts, IDs internos, rutas locales, claves) son solo tan buenos como la matriz de fixtures. Mitigación: ampliar fixtures en futuros ciclos (`ADR-INT-003` ya registra la brecha con Atelier).
- GitHub Actions es una dependencia operativa. Mitigación: acciones estándar sin configuración especial; los mismos pasos se ejecutan localmente con pnpm, y cambiar de CI no toca contenido ni lógica (`ARQ-4`).

## Trazabilidad (se completa al implementar)

| Criterio | Prueba / verificación | PR / commit |
|---|---|---|
| CA-1 | `pnpm test:contract` + `pnpm validate` sobre la matriz de fixtures | Pendiente de commit |
| CA-2 | Run de CI en el PR que introduce este cambio | Pendiente de commit |
| CA-3 | `pnpm validate` con `content/` vacío → exit 0 | Pendiente de commit |
| CA-4 | Revisión del código del validador | Pendiente de commit |
| CA-5 | Revisión del código: sin llamadas de red ni despliegue | Pendiente de commit |

## Pendientes y limitaciones registradas

- La prueba real de reversión (`LU-F1-S5`) y el primer export validado (`LU-F1-S6`, `INT-2`) requieren contenido real; se ejecutarán al importar el primer contenido.
- `docs/INDEX.md` y changelog se actualizan en el mismo PR de implementación.
