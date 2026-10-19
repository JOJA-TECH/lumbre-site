# SPEC-004: Elección inicial de hosting — Cloudflare Workers static assets

- **Estado:** Aprobada
- **Nivel:** N2
- **Repo:** lumbre-site
- **Origen:** elección explícita del propietario, 2026-10-15
- **Cubre:** `LU-F0-S1`, `LU-G-L`, `ARQ-4`
- **ADR relacionados:** `ADR-002` (aceptado), `ADR-004` (aceptado)
- **Reglas de AGENTS.md que aplican:** `ARQ-1`, `ARQ-4`, `PUB-1`, `PRI-2`, `PRI-3`
- **Fecha / autor:** 2026-10-15 · aprobada por instrucción del propietario

## Problema

El proyecto necesita un proveedor inicial para desplegar el artefacto estático y revisar cambios de staging antes de producción. Sin delimitar esta elección, hosting, build y contenido pueden acoplarse.

## Usuario y flujo afectado

La persona propietaria revisa la preview de un PR y promueve manualmente una versión aprobada; los lectores reciben `dist/` estático.

## Objetivos (medibles)

- Usar Cloudflare Workers static assets como proveedor inicial.
- Conservar build y sitio independientes de APIs de Worker y del proveedor, según `ADR-004`.
- Mantener la separación staging/producción y promoción manual.
- Verificar cuenta, plan, permisos, límites, redirects y headers antes del lanzamiento.

## Alcance

- Registrar selección inicial y uso de Workers Builds/Previews para revisión de cambios.
- Mantener la decisión reversible con configuración específica aislada.
- Dejar el despliegue productivo sujeto a `LU-G-L`.

## Fuera de alcance

- Crear una cuenta, alterar DNS, comprar dominio, configurar credenciales o desplegar el sitio.
- Incorporar código dinámico de Worker a la aplicación de lectura.
- Integrar publicidad, analítica u otro proveedor externo.

## Reglas de comportamiento

- El build produce el mismo `dist/` portable sin depender de Cloudflare.
- PR/preview se usa como staging revisable; producción requiere promoción humana.
- Confirmar que redirects y headers funcionan y no filtran contenido/secretos en previews antes de producción.
- La migración a otro host se hace mediante reemplazo de configuración y verificación, sin cambiar contenido ni lógica editorial.

## Contratos y datos afectados

No cambia schemas, contenido, URLs, canonical ni política de privacidad. Cloudflare es el proveedor del despliegue inicial; Ads queda fuera de alcance y requerirá SPEC/ADR propios.

## Criterios de aceptación

- **CA-1** El proveedor inicial se documenta como Cloudflare Workers static assets.
- **CA-2** La configuración Cloudflare queda fuera del código de lectura y el `dist/` se conserva portable.
- **CA-3** Staging/preview y producción tienen flujos separados y promoción manual.
- **CA-4** Cuenta/plan/límites, permisos de preview, redirects, headers, canonical y RSS se verifican antes de `LU-G-L`.
- **CA-5 (negativo)** Esta decisión no autoriza añadir Ads, Workers dinámicos, cuenta/DNS ni desplegar producción.

## Riesgos y evidencia que los invalidaría

Si el preview no protege el contenido aún no aprobado o las reglas HTTP requeridas no funcionan, detener la salida a producción y corregir el adaptador o reconsiderar el proveedor.

## Preguntas abiertas

| Pregunta | Quién responde | ¿Bloquea? |
|---|---|---|
| ¿Qué cuenta y plan están disponibles, y quién puede administrar DNS/secrets? | Propietario/a | Bloquea lanzamiento, no la decisión inicial |

## Trazabilidad (se completa al implementar)

| Criterio | Prueba / verificación | PR / commit |
|---|---|---|
| CA-1…CA-5 | Pendiente de implementación; CA-4 se verifica antes de `LU-G-L` | — |

## Pendientes y limitaciones registradas

- Elegir proveedor no despliega el sitio ni verifica titularidad/plan/costo.
- Cloudflare Pages, Netlify y GitHub Pages permanecen opciones viables conforme a `ADR-004`.
- Ads y su tratamiento de texto público/datos de lectores requieren evaluación separada.
