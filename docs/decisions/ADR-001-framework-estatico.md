# ADR-001: Framework y modo de renderizado

- **Estado:** Aceptado
- **Fecha:** 2026-10-15
- **Alcance:** Lumbre
- **Motivada por:** `SPEC-002` · `LU-F0-S4`, `LU-F2-S4` · reglas `ARQ-1`, `ARQ-4`
- **Reglas de AGENTS.md afectadas:** `ARQ-1`, `ARQ-2`, `ARQ-4`, `ARQ-5`
- **Revisar cuando:** las colecciones locales ya no cubran las necesidades editoriales o una necesidad aprobada abra la puerta `LU-G-D`.

## Contexto

El repositorio describe contenido Markdown local, lectura estática y funciones de colección. No hay aún framework ni implementación. La documentación oficial de Astro describe colecciones de build-time para Markdown local y generación estática como el comportamiento predeterminado ([Content Collections](https://docs.astro.build/en/guides/content-collections/)).

## Decisión propuesta

Adoptar Astro 7.x en modo estático con Content Collections de build-time para el primer nivel de Lumbre. Las guías oficiales vigentes describen `glob()` para colecciones locales Markdown y la salida estática `dist/`; para servir esos assets en Workers se configura `assets.directory` y no se instala el adaptador SSR de Cloudflare. Mantener un CLI de validación independiente del framework; usar colecciones para tipado y consultas, sin delegar en ellas las reglas de lote que el contrato no puede expresar.

Fijar versiones exactas mediante `pnpm-lock.yaml` y documentar la versión de Node soportada. El propietario pidió usar pnpm y actualizar las dependencias a sus versiones estables más recientes el 2026-10-15; se acepta el salto mayor Astro 7 después de comprobar su guía oficial y la disponibilidad de `glob()` y salida estática. TypeScript queda en 6.0.3, última versión 6.x disponible en la consulta, porque Astro Check 0.9.10 rechaza TypeScript 7.0.2. No usar colecciones en vivo, adaptadores SSR ni despliegue acoplado a un proveedor.

## Alternativas consideradas

| Alternativa | Por qué se descarta |
|---|---|
| HTML escrito a mano / generador mínimo | No aporta colecciones tipadas para varias obras y capítulos; podría reconsiderarse si el alcance real es menor. |
| Framework SSR/full-stack | Contradice `ARQ-1` y no existe necesidad demostrada que abra `LU-G-D`. |

## Consecuencias positivas

- Se alinea con Markdown local, build estático y validación de colecciones tipada.
- Rutas y páginas pueden generarse durante build sin runtime del proveedor.

## Consecuencias negativas

- Las APIs y versión de Astro deben fijarse y mantenerse.
- El schema de Content Collections no reemplaza validación adicional de publicación ni JSON Schema v1.

## Riesgos y evidencia que invalidaría la decisión

Si la versión vigente no puede validar campos desconocidos conforme a la regla estricta o producir `dist/` portable, se vuelve a comparar framework antes de inicializar.

## Implementación y migración / reversión

La actualización a Astro 7 fue autorizada explícitamente por el propietario junto con la instrucción de actualizar dependencias el 2026-10-15. La configuración y comandos se documentarán en `package.json`; la reversión es retirar Astro antes de publicar URLs.

## Decisiones relacionadas

`ADR-002` hosting · `ADR-003` URLs · `ADR-INT-001` contrato v1.

## Evidencia oficial consultada (2026-10-15)

- [Content Collections API Reference](https://docs.astro.build/en/reference/modules/astro-content/): loader local `glob()` y schema de colección en build-time.
- [Deploy your Astro Site to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/): configuración de Workers con `assets.directory: "./dist"`; el adaptador `@astrojs/cloudflare` se indica para renderizado bajo demanda.
- [Astro 7.3](https://astro.build/blog/astro-730/): versión estable vigente consultada el 2026-10-15; el salto desde Astro 6 incorpora cambios mayores y se actualizará la verificación de compatibilidad antes de cerrar SPEC-005.
- [pnpm en npm](https://www.npmjs.com/package/pnpm): versión estable 12.11.2 fijada en `packageManager` al consultar el 2026-10-15.

La documentación respalda la compatibilidad técnica. El propietario aprobó la decisión inicial el 2026-10-15 y posteriormente autorizó explícitamente el salto a versiones estables recientes el mismo día; la verificación local queda pendiente.
