# SPEC-005: Base estática y colecciones de contenido

- **Estado:** Verificada
- **Nivel:** N2
- **Repo:** lumbre-site
- **Origen:** F0 de `ROADMAP.md`; autorización explícita del propietario para crear el sitio por fases, 2026-10-15
- **Cubre:** `LU-F0-S4`, `LU-F2-S4`, `ARQ-1`, `ARQ-2`, `ARQ-4`
- **ADR relacionados:** `ADR-001`, `ADR-002`, `ADR-004`, `ADR-INT-001`
- **Reglas de AGENTS.md que aplican:** `CON-1…CON-4`, `ARQ-1`, `ARQ-2`, `ARQ-4`, `PRI-2`, `PRI-3`
- **Fecha / autor:** 2026-10-15 · aprobada por autorización del propietario para ejecutar F0

## Problema

El repositorio contiene el contrato y las decisiones iniciales, pero no existe una aplicación que produzca el artefacto estático de Lumbre ni una representación tipada del contrato en Astro. Sin esta base, F1 no puede validar que el sitio compile contenido aprobado y F2 no puede componer las páginas de lectura.

## Usuario y flujo afectado

La persona propietaria mantiene y revisa el repositorio. En fases posteriores, lectores consultarán las publicaciones aprobadas exportadas desde Atelier.

## Objetivos (medibles)

- Inicializar la aplicación Astro 7 en modo estático y producir `dist/` portable.
- Definir colecciones locales de obra y capítulo alineadas con JSON Schema v1.
- Mantener los archivos de hosting fuera del código de lectura y evitar cualquier runtime de proveedor.
- Conservar en Git los comandos de desarrollo, verificación y build realmente disponibles.

## Alcance

- `package.json`, lockfile, configuración mínima de Astro/TypeScript y scripts locales.
- Colecciones Astro de build-time para `content/<work>/_obra.md` y `content/<work>/<slug>.md`.
- Esquemas estrictos derivados de `contract/v1/obra.schema.json` y `capitulo.schema.json`, sin modificar el contrato fuente.
- Configuración aislada de Workers Static Assets para servir `dist/`, sin cuenta, secretos, DNS, CI conectado ni despliegue.
- Convención documentada de promoción: PR y preview son staging; `main` es producción tras revisión humana y merge.
- Estructura inicial por funcionalidad; `src/pages/` se reserva para rutas/composición.
- Documentación de instalación y comandos reales en `README.md`.

## Fuera de alcance

- CLI de validación de lotes, fixtures nuevas y CI: corresponden a F1 y `SPEC-001`/`ADR-INT-003`.
- Páginas de lectura, catálogo, diseño, URLs emitidas y contenido real: corresponden a F2 y al flujo editorial.
- Comprar dominio, verificar marca, configurar cuenta/DNS/secrets o desplegar Workers.
- Cualquier integración de Ads, analítica, comentarios u otro script externo.
- Cambio de contrato, schema fuente, versión, estados o semántica de los campos.

## Reglas de comportamiento

- `astro build` genera un `dist/` estático; el proyecto no requiere SSR ni binding de runtime.
- Colecciones cargan únicamente Markdown local de `content/`; ningún loader remoto consulta servicios externos.
- El esquema de cada colección rechaza campos desconocidos y refleja nombres, tipos y obligatoriedad de JSON Schema v1.
- `src/pages/` enruta y compone; el código por funcionalidad vive en `src/features/content/`.
- La configuración Cloudflare es prescindible y no altera el artefacto `dist/`.
- No se cargan scripts de terceros ni se envían historias a servicios externos.

## Contratos y datos afectados

Se consume el contrato v1 sin modificarlo. La colección no sustituye al validador de publicación de F1: reglas de lote/cuerpo como unicidad, fechas futuras, enlaces, contenido vacío y patrones privados quedan allí.

## Criterios de aceptación

- **CA-1** El proyecto usa pnpm, fija Astro 7.x y las dependencias directas en las versiones estables más recientes compatibles con la verificación de Astro, conserva lockfile reproducible y declara la versión mínima de Node usada.
- **CA-2** La configuración de Astro genera salida estática en `dist/`; una instalación limpia puede ejecutar los comandos documentados.
- **CA-3** Las colecciones de obra/capítulo reflejan los schemas v1 y fallan ante una propiedad desconocida; no se añade contenido a `content/` para probar el scaffold.
- **CA-4** La configuración de Cloudflare apunta a `dist/`, no incluye entrypoint dinámico ni dependencias de runtime y puede eliminarse sin tocar el código de Astro.
- **CA-5** La documentación distingue staging en PR/preview y producción en `main`, con revisión humana antes del merge; no se conecta aún la cuenta.
- **CA-6** La estructura de código sigue `ARQ-2`; no aparecen `utils/`, `helpers/` o `components/` genéricos.
- **CA-7** No se añade script externo, cuenta, secreto, dominio, despliegue ni contenido editorial.
- **CA-8** README documenta exclusivamente comandos presentes en `package.json` y el estado de los pasos aún pendientes.

## Casos de error

Si la versión estable vigente de Astro no puede cumplir modo estático, loaders locales o validación estricta, detener la implementación y volver a revisar `ADR-001`; no relajar JSON Schema v1.

## Riesgos y evidencia que los invalidaría

- Una duplicación divergente de Zod y JSON Schema puede aceptar estados distintos. F1 debe añadir comparación automatizada contra las mismas fixtures antes de declarar validación completa.
- La colección no equivale a validar un lote publicable; no se marca ningún criterio de `PUB-3` cumplido con este scaffold.
- La configuración aislada de Workers no confirma que la cuenta concreta tenga permisos, plan o flujo de previews; eso se verifica en `LU-G-L`.
- La verificación no realiza auditoría de vulnerabilidades; una instalación npm anterior notificó 3 avisos y el detalle no pudo consultarse. Resolver antes de cerrar la revisión de dependencias.
- La salida del build actual es estática pero vacía (0 páginas); F2 creará las páginas públicas y repetirá las verificaciones de rutas y contenido.

## Preguntas abiertas

| Pregunta | Quién responde | ¿Bloquea? |
|---|---|---|
| ¿Qué Node LTS se fija para CI y desarrollo? | Proyecto | No; esta entrega documentará la versión local compatible y permitirá actualizarla coordinadamente |
| ¿Puede Atelier compartir la convención y hash de fixtures? | Mantenedor/a de Atelier | Sí, para `INT-1` y para completar `SPEC-001` |

## Trazabilidad (se completa al implementar)

| Criterio | Prueba / verificación | PR / commit |
|---|---|---|
| CA-1 | `package.json` fija pnpm 12.11.2; `pnpm-lock.yaml` resuelve Astro 7.3.8, TypeScript 6.0.3 (Astro Check 0.9.10 falla explícitamente con 7.0.2), `@astrojs/check` 0.9.10 y Wrangler 4.151.0. `pnpm install --frozen-lockfile` confirma que el lockfile está al día. | — |
| CA-2 | `pnpm check`: 0 errores, 0 warnings, 0 hints. `pnpm build`: `output: static`, genera `dist/` y termina correctamente. Produce 0 páginas porque F2 aún no define rutas ni hay contenido aprobado. | — |
| CA-3 | Pruebas en memoria con Zod: frontmatter válido de obra/capítulo aceptado; ambos schemas rechazan `internal_id` desconocido. Código `.strict()` y sin archivos añadidos a `content/`. | — |
| CA-4 | Revisión de `wrangler.jsonc`: `assets.directory: "./dist"`, sin `main` ni runtime de aplicación; Astro mantiene `output: 'static'`. | — |
| CA-5 | README documenta PR/previews como staging y `main` como producción solo tras revisión humana y merge; no hay cuenta conectada. | — |
| CA-6 | Revisión de `src/`: código agrupado en `src/features/content/`; no hay carpetas genéricas `utils/`, `helpers/` o `components/`. | — |
| CA-7 | Revisión del alcance y árbol: sin scripts externos, Ads, analítica, comentarios, cuenta, secreto, dominio, despliegue ni contenido editorial. | — |
| CA-8 | Los comandos README (`pnpm install --frozen-lockfile`, `dev`, `check`, `build`, `preview`) existen en `package.json`. | — |

## Pendientes y limitaciones registradas

- Esta base no completa F0: quedan la política de slug/redirecciones, las políticas editoriales/de privacidad, fixtures completas y la evidencia de integración con Atelier.
- No se configura despliegue ni se habilita contenido real.
