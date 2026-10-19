# SPEC-002: Decisiones base de framework, URLs y hosting

- **Estado:** Aprobada
- **Nivel:** N2
- **Repo:** lumbre-site
- **Origen:** hipótesis `H-LU-01…03` y criterios `LU-F0-S1`, `LU-F0-S3…S4`, `LU-G-L`
- **Cubre:** `LU-F0-S1`, `LU-F0-S3…S4`, `LU-F2-S4`, `LU-F3-S5`, `LU-G-L`, `INT-4`
- **ADR relacionados:** `ADR-001`, `ADR-002`, `ADR-003`, `ADR-004` (aceptados)
- **Reglas de AGENTS.md que aplican:** `ARQ-1`, `ARQ-4`, `CON-5`, `PUB-1`, `SEO-1`
- **Fecha / autor:** 2026-10-15 · aprobada por el propietario para decisiones base

## Problema

El roadmap deja framework, URLs y hosting como hipótesis. Empezar el sitio sin cerrar cómo se generan páginas estáticas, cómo se preservan URLs compartidas y cómo se revisa un preview puede causar retrabajo en rutas, configuración y flujo de publicación. La revisión oficial del 2026-10-15 confirmó capacidades actuales de previews, redirecciones y cabeceras en las opciones contempladas, pero falta comprobar límites de cuenta, costos y preferencia del propietario.

## Usuario y flujo afectado

El autor mantiene el repositorio, revisa cambios de contenido en staging y publica un sitio estático portable para lectores.

## Objetivos (medibles)

- Las decisiones aceptadas preservan salida estática portable y Content Collections locales de build-time.
- Existe una política aprobada de URL pública y cambio de slug que declara cómo conserva la dirección antigua.
- El flujo elegido distingue staging de producción y permite revisión humana de preview antes de producción.
- Cada decisión queda registrada en un ADR aceptado antes de su implementación.

## Alcance

- Comparar y proponer framework/modo de renderizado para Markdown local.
- Comparar Cloudflare Workers static assets, GitHub Pages y Netlify para previews por PR, redirecciones, cabeceras, plan/costos y portabilidad.
- Definir patrón de URLs de obra/capítulo, canonical y tratamiento de slug antiguo en relación con `uid`.
- Actualizar `ROADMAP.md`, `docs/INDEX.md` y los ADR una vez que el humano acepte las decisiones.

## Fuera de alcance

- Inicializar la app, instalar paquetes, crear configuración de proveedor o CI.
- Comprar dominio, confirmar disponibilidad legal/comercial o modificar DNS.
- Publicar historias o desplegar producción.
- Cambiar el contrato v1 o habilitar SSR/backend.

## Reglas de comportamiento

- La salida construida es un `dist/` estático portable; configuración propia de hosting queda en archivos separados.
- Staging y producción se distinguen de forma documentada y la promoción requiere revisión humana.
- Toda URL canónica de contenido usa una regla aprobada; un cambio de slug no deja la URL anterior sin respuesta de redirección o alternativa aprobada.
- La opción elegida no carga scripts externos como requisito del build.

## Contratos y datos afectados

No se propone cambiar el frontmatter ni el schema. Se pueden definir rutas y un manifiesto/configuración de redirecciones, sujeto al ADR-003 aceptado. Hosting toca despliegue y URL pública, por lo que cada cambio es N2.

## Criterios de aceptación

- **CA-1** `ADR-001` compara Astro estático con Content Collections de build-time frente a alternativas justificadas, registra fuentes oficiales y fija Astro 7 como versión mayor tras solicitud posterior del propietario; `pnpm-lock.yaml` fija las dependencias efectivas.
- **CA-2** `ADR-002` compara proveedores y documenta límites/costos publicados; cuenta, plan y permisos específicos siguen como bloqueo de lanzamiento en `LU-G-L`.
- **CA-3** `ADR-003` fija `/obras/{work}/` y `/obras/{work}/{slug}/`, identidad estable basada en `uid` y el requisito de redirección permanente al cambiar slug.
- **CA-4** La opción aceptada no exige SSR/backend y mantiene portable la salida estática (`ARQ-1`, `ARQ-4`).
- **CA-5** Las tres decisiones reciben aprobación humana antes de inicializar la app o configurar despliegue.
- **CA-6 (negativo)** No se publica contenido ni se configura DNS/despliegue de producción como parte de esta SPEC.

## Casos de error

Si un hosting no permite la redirección requerida o un preview aislado sin exponer secretos, el ADR debe declararlo como incompatibilidad y la opción no puede recomendarse como elegida.

## Riesgos y evidencia que los invalidaría

- Cambios de proveedor o planes pueden invalidar límites y costos; verificar documentación y cuenta al aceptar el ADR y otra vez antes de lanzar (`LU-G-L`).
- La identidad `uid` por sí sola no crea una redirección: se necesita persistir y emitir la relación URL antigua → URL canónica.

## Preguntas abiertas

| Pregunta | Quién responde | ¿Bloquea? |
|---|---|---|
| ¿Qué cuenta/plan y permisos están disponibles? | Propietario/a | Sí, para configurar previews y antes del lanzamiento; no bloquea el build local |
| ¿Qué ruta antigua debe redirigirse en un cambio real de slug? | Propietario/a + implementación | Sí, para comprobar `INT-4`; no bloquea la inicialización |

## Trazabilidad (se completa al implementar)

| Criterio | Prueba / verificación | PR / commit |
|---|---|---|
| CA-1, CA-3…CA-6 | ADR-001/002/003/004 aceptados y aprobación humana registrada | — |
| CA-2 | Matriz en ADR-002; cuenta/plan/permisos por confirmar en `LU-G-L` | — |

## Pendientes y limitaciones registradas

- No se verificó la cuenta, el plan ni la titularidad de dominios del proyecto.
- Las fuentes oficiales consultadas describen capacidades actuales, no garantizan disponibilidad contractual ni costo para esta cuenta.
- La aceptación de decisiones no autoriza compra de dominio, configuración de DNS, acceso a cuenta ni despliegue productivo.
