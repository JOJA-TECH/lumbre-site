# ADR-003: URLs públicas, slug y redirecciones

- **Estado:** Aceptado
- **Fecha:** 2026-10-15
- **Alcance:** Lumbre
- **Motivada por:** `SPEC-002` · `LU-F0-S3`, `LU-F3-S5`, `INT-4` · riesgo `R-LU-05`
- **Reglas de AGENTS.md afectadas:** `CON-5`, `SEO-1`, `ARQ-4`
- **Revisar cuando:** se fije un dominio o aparezca evidencia de que la ruta aprobada no funciona con lectores/hosting.

## Contexto

El contrato define `work`, `slug` y `uid` estable, pero todavía no existe una URL publicada ni política operativa para conservar enlaces. El hosting determina cómo expresar y probar redirecciones. El cambio de slug ya está identificado como riesgo e hito `INT-4`.

## Decisión propuesta

Usar el prefijo público `/obras/` y rutas jerárquicas: `/obras/{work}/` para la ficha de obra y `/obras/{work}/{slug}/` para cada relato o capítulo. Mantener `uid` como identidad estable para enlazar el capítulo antes y después de un cambio de slug. Al cambiar slug, registrar URL anterior → URL canónica en una fuente versionada independiente del proveedor y producir una redirección permanente verificable en el hosting elegido antes de retirar o corregir la página anterior.

El propietario aprobó el prefijo y los patrones anteriores el 2026-10-15. No se debe emitir ninguna URL pública hasta publicar el sitio. La ubicación y el formato del registro se definirán en la SPEC de F3, manteniendo una sola fuente de redirecciones y adaptadores específicos por hosting.

## Alternativas consideradas

| Alternativa | Por qué queda como alternativa |
|---|---|
| URL basada solo en `uid` opaco | Es estable aunque cambie el slug, pero reduce legibilidad y necesita resolver el título de URL. |
| URL con slug y sin registro histórico | Es legible, pero rompe enlaces compartidos al renombrar y contradice `CON-5`. |
| Generar páginas alias sin redirect HTTP | Puede mantener acceso en hosting limitado, pero no cumple claramente la preservación por redirección pedida en `LU-F3-S5`. |

## Consecuencias positivas

- El slug puede corregirse sin perder el vínculo lógico del capítulo.
- La política hace explícito que `uid` no es el ID interno de Atelier y no debe cambiar.

## Consecuencias negativas

- Hace falta persistir el mapa de URLs previas y probar la salida específica del proveedor.
- Los prefijos de URL aprobados son públicos y difíciles de cambiar luego.

## Riesgos y evidencia que invalidaría la decisión

Si el hosting escogido no admite redirecciones permanentes necesarias, esta propuesta debe revisarse antes de aceptar el ADR-002/003. `INT-4` será la prueba real antes de cerrar el ciclo.

## Implementación y migración / reversión

Pendiente de aprobación de `SPEC-002`, elección de patrón por el propietario y aceptación de ADR-002. No existen URLs públicas que migrar. El plan de implementación debe definir el registro de redirecciones, su validación y la prueba de reversión antes de publicación.

## Decisiones relacionadas

`ADR-001` framework · `ADR-002` hosting · `ADR-INT-001` identidad `uid`.

La decisión no cambia el contrato v1: `work`, `slug` y `uid` ya están definidos.
