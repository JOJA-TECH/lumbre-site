# ADR-004: Agnosticismo al proveedor y cambio de hosting

- **Estado:** Aceptado
- **Fecha:** 2026-10-15
- **Alcance:** Lumbre
- **Motivada por:** `SPEC-003` · `ARQ-4`, `LU-F0-S1`, `LU-G-L` · riesgo `R-LU-03`
- **Reglas de AGENTS.md afectadas:** `ARQ-1`, `ARQ-4`, `PUB-1`
- **Revisar cuando:** se apruebe una necesidad que requiera runtime, API o datos exclusivos de hosting; abriría evaluación de `LU-G-D` o una SPEC nueva.

## Contexto

Lumbre es un sitio editorial estático y debe conservar la salida portable y la revisión manual antes de producción. Cloudflare, GitHub Pages y Netlify reciben sitios estáticos, pero difieren en preview por PR, redirects, headers y cuotas. Una migración sin rehacer el sitio es un objetivo de arquitectura, no una garantía de cero trabajo operativo.

## Decisión

**Lumbre es agnóstico al proveedor de hosting y puede cambiar de proveedor en cualquier momento operativo.** El contenido, el contrato, el código de páginas y la lógica de lectura no dependen del host; el build produce un `dist/` estático portable. Configuración de preview/deploy, redirects, headers, secretos de CI, dominio y DNS se mantiene en adaptadores/configuración aislados del sitio.

El cambio de proveedor no requiere rediseñar páginas, migrar contenido o alterar el contrato. Sí requiere configurar el adaptador de destino, validar la equivalencia de URLs, redirects, headers, canonical, RSS y 404, preparar DNS/TLS y realizar la transición. No se promete migración instantánea, costo idéntico ni cero interrupción. Si un proveedor no soporta una función requerida, no se introduce dependencia implícita: se usa un adaptador compatible o se elige otro destino.

Esta decisión fija la política de arquitectura y no el proveedor inicial. `ADR-002` conserva la comparación/elección inicial.

## Alternativas consideradas

| Alternativa | Por qué se descarta |
|---|---|
| Adoptar desde el inicio funciones exclusivas del proveedor | Acopla lectura/contenido y encarece el cambio que el propietario quiere poder hacer. |
| Prometer cambio automático e instantáneo | DNS, certificados, reglas HTTP, cuenta y cuotas requieren operaciones específicas y verificaciones. |
| Abstraer todas las capacidades de todos los hosts en una capa de runtime | Agrega complejidad y puede exigir SSR/backend, fuera de Nivel 1. |

## Consecuencias positivas

- El proveedor inicial sigue siendo una elección reversible.
- El contenido y el código editorial se conservan al migrar.
- Las diferencias inevitables quedan visibles y probadas en configuración/adaptadores.

## Consecuencias negativas

- Hay que mantener y verificar configuración por proveedor.
- No todas las plataformas ofrecen paridad nativa de previews, redirects y headers.
- La migración puede necesitar cambio de DNS/TLS y ventana de transición.

## Riesgos y evidencia que invalidaría la decisión

- Si páginas, esquemas o build requieren APIs del host, `ARQ-4` se incumple; la revisión de imports/configuración debe detectarlo.
- Si una función editorial depende de ejecución dinámica, requiere nueva SPEC y revisión de la puerta `LU-G-D` antes de adoptarse.

## Implementación y migración / reversión

En cada proveedor, generar el mismo `dist/` y conservar reglas editoriales en una fuente declarativa comprobable. Antes de cambiar producción, desplegar preview, probar rutas/redirecciones/cabeceras/RSS/canonical, comprobar DNS/TLS y conservar el despliegue anterior para reversión. Los pasos específicos y responsables se detallan en el ADR del proveedor inicial.

## Decisiones relacionadas

`ADR-001` framework · `ADR-002` proveedor inicial · `ADR-003` URLs · `SPEC-003`.
