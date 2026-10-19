# ADR-002: Hosting estático y flujo de previews

- **Estado:** Aceptado
- **Fecha:** 2026-10-15
- **Alcance:** Lumbre
- **Motivada por:** `SPEC-002` · `LU-F0-S1`, `LU-G-L` · riesgo `R-LU-03`
- **Reglas de AGENTS.md afectadas:** `ARQ-4`, `PUB-1`, `PUB-2`
- **Revisar cuando:** cambien las condiciones de cuenta, el volumen/costo de tráfico o los requisitos de redirección.

## Contexto y comparación cruzada

Comparación según documentación oficial consultada el **2026-10-15**. Todos pueden recibir un build estático; las diferencias principales son previews por PR, HTTP de borde y límites/costo.

| Proveedor | Preview por PR | Redirects y headers | Límites/costo relevantes publicados | Evaluación para Lumbre |
|---|---|---|---|---|
| **Cloudflare Workers static assets** | Workers Builds despliega preview para ramas no productivas y puede comentar la URL en PR de GitHub/GitLab. | `_redirects` y `_headers`; hasta 2,100 redirects, 100 reglas de headers. | Free: 20,000 assets/versión, 25 MiB por archivo; peticiones a static assets sin costo y sin límite. Workers Paid parte de USD 5/mes si se ejecuta lógica Worker; no es necesario para solo servir assets. | Muy buen ajuste estático; revisar límite de archivos y aislar secretos/funciones de Worker. [Previews](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/) · [límites](https://developers.cloudflare.com/workers/platform/limits/) · [precio](https://developers.cloudflare.com/workers/platform/pricing/). |
| **Cloudflare Pages** | URL única por PR del mismo repositorio; previews activos sin límite publicado. | `_redirects` y `_headers`; hasta 2,100 redirects y 100 reglas de headers. | Free: 500 deploys/mes, 1 build concurrente; peticiones a assets estáticos sin costo y sin límite. | Apto para estático. Cloudflare presenta Workers como plataforma principal para proyectos nuevos; Pages continúa disponible. [Previews](https://developers.cloudflare.com/pages/configuration/preview-deployments/) · [límites](https://developers.cloudflare.com/pages/platform/limits/) · [estado del producto](https://developers.cloudflare.com/pages/). |
| **GitHub Pages** | `actions/deploy-pages` tiene modo preview en alpha y no disponible al público; un workflow puede validar PR, pero una URL preview hospedada exige otro mecanismo. | La documentación de Pages consultada no ofrece reglas nativas equivalentes a `_redirects`/`_headers`; requeriría páginas de redirección, CDN/proxy o configuración adicional. | Sitio publicado ≤1 GB; soft limit 100 GB/mes; 10 builds/hora salvo build/publicación con workflow personalizado. | Muy integrado al repo y Actions, pero más débil para previews públicos por PR y redirects HTTP fiables sin servicio adicional. [workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) · [límites](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) · [acción oficial](https://github.com/actions/deploy-pages). |
| **Netlify** | Deploy Preview automático al abrir PR desde un repo conectado; URL única y estado en PR. | `_redirects` o `netlify.toml`; `_headers` o `netlify.toml`. | En cuentas nuevas con créditos: Free USD 0 / 300 créditos mes; previews 0 créditos; deploy productivo 15 créditos; bandwidth 20 créditos/GB y requests 2 créditos/10,000. Cuentas antiguas pueden seguir plan legacy. | Revisión de PR muy sencilla; vigilar consumo mensual, plan real y diferencias de contexto en headers. [previews](https://docs.netlify.com/deploy/deploy-types/deploy-previews/) · [routing](https://docs.netlify.com/manage/routing/overview/) · [créditos](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/). |

**Lectura:** Workers static assets ofrece el equilibrio más fuerte para un sitio puramente estático con previews, redirects y headers; Netlify simplifica la experiencia de preview y mide el tráfico por créditos; GitHub Pages reduce piezas de hosting, pero no resuelve por sí solo la preview hospedada por PR ni las reglas HTTP; Pages sigue siendo viable, aunque Cloudflare presenta Workers como la plataforma principal para proyectos nuevos. Los límites y precios son los publicados y no confirman qué plan/cuenta posee Lumbre.

## Decisión

Mantener `dist/` estático e independiente del proveedor. Se elige **Cloudflare Workers static assets** como proveedor inicial, según instrucción explícita del propietario y alcance de `SPEC-004`. La aplicación no dependerá de APIs de Worker para servir la experiencia de lectura; el hosting recibe el artefacto estático. Workers Builds/Previews se usará para revisar cambios de staging por PR; producción se mantendrá bajo promoción humana. Redirects y headers deben probarse en el proveedor antes del lanzamiento.

La elección inicial no revoca `ADR-004`: el proveedor puede cambiarse con adaptación de configuración y validación. La cuenta/plan disponibles, permisos/secrets y límites se confirmarán antes de producción en `LU-G-L`. Esta aceptación decide el proveedor de arranque; no autoriza despliegue ni publicación.

## Alternativas consideradas

| Alternativa | Por qué queda como alternativa |
|---|---|
| GitHub Pages | Deploy por Actions está documentado, pero falta definir/operar preview seguro por PR y verificar cómo representar redirect rules. |
| Netlify | Los previews y routing están documentados; falta confirmar plan, límites/costos de la cuenta y si el proveedor es aceptable. |
| Cloudflare Pages | El roadmap compara la ruta actual de Workers static assets; Pages debe incluirse si el propietario ya tiene cuenta o requisito que la favorezca. |

## Consecuencias positivas

- Mantener la compilación portable desacopla el framework del alojamiento.
- La revisión del preview queda dentro del flujo de PR si la integración se confirma.

## Consecuencias negativas

- Previews automáticos pueden necesitar permisos/secrets; las PRs desde forks requieren cuidado explícito.
- El proveedor y sus límites siguen siendo una dependencia operativa que se debe revisar antes de lanzamiento.

## Riesgos y evidencia que invalidaría la decisión

Si previews exponen contenido no aprobado, secretos, o las redirecciones requeridas no funcionan de forma comprobable, se corrige la configuración o se elige otro proveedor antes de producción.

## Implementación y migración / reversión

Pendiente de implementación de la configuración, confirmación de cuenta/plan y prueba de preview. La configuración del proveedor vivirá en sus archivos, nunca en el código que genera `dist/`.

## Decisiones relacionadas

`ADR-001` framework · `ADR-003` URLs · `ADR-004` agnosticismo al proveedor · `ADR-INT-002` promoción manual · `SPEC-004` elección inicial.
