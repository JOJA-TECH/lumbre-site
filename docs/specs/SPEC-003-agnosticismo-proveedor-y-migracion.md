# SPEC-003: Agnosticismo al proveedor y migración de hosting

- **Estado:** Aprobada
- **Nivel:** N2
- **Repo:** lumbre-site
- **Origen:** decisión explícita del propietario · regla `ARQ-4`
- **Cubre:** `ARQ-4`, `LU-F0-S1`, `LU-G-L`
- **ADR relacionados:** `ADR-004` (aceptado)
- **Reglas de AGENTS.md que aplican:** `ARQ-1`, `ARQ-4`, `PUB-1`
- **Fecha / autor:** 2026-10-15 · aprobada por instrucción del propietario

## Problema

La selección de hosting no debe acoplar la arquitectura, el contenido o el flujo de lectura a un proveedor. Sin límites explícitos, características convenientes del hosting podrían filtrarse a la aplicación y encarecer una migración futura.

## Usuario y flujo afectado

La persona propietaria puede escoger o sustituir el proveedor de publicación; las personas lectoras continúan recibiendo el mismo sitio estático y URLs canónicas.

## Objetivos (medibles)

- La aplicación genera el mismo `dist/` estático portable para cualquier proveedor compatible.
- La lógica de contenido y lectura no importa SDKs ni APIs de hosting.
- Un proveedor puede sustituirse sin migrar el contrato, el contenido o las rutas editoriales.
- La configuración de previews, publicación, DNS, cabeceras y redirecciones se puede reemplazar y probar de forma aislada.

## Alcance

- Definir el límite entre sitio y despliegue, y exigir adaptadores/configuración separados por proveedor.
- Permitir cambiar el hosting inicial en cualquier momento operativo, con una validación de equivalencia y un plan de transición.
- Mantener decisiones sobre proveedor y cuenta fuera del contrato de contenido.

## Fuera de alcance

- Garantizar disponibilidad sin interrupción, costo idéntico o conservación de una cuenta/URL temporal del proveedor.
- Abstraer o habilitar automáticamente APIs exclusivas de cada proveedor.
- Elegir ahora el proveedor inicial; esa decisión corresponde a `SPEC-002`/`ADR-002`.
- Evitar una actualización de DNS, TLS, secretos de CI o reglas específicas al migrar.

## Reglas de comportamiento

- El código de páginas, validadores y procesamiento de contenido no depende de proveedor de hosting.
- El build produce `dist/`; los archivos específicos de despliegue no alteran el contenido de ese artefacto.
- Redirects y headers tienen una fuente declarativa y verificable; cada adaptador los representa con reglas equivalentes o declara la limitación antes de elegir proveedor.
- El proceso de cambio incluye despliegue de prueba, comprobación de URLs/canonical/RSS/headers, cambio de DNS cuando aplique y verificación posterior.
- “En cualquier momento” significa que la arquitectura permite iniciar una migración sin rediseñar el sitio; no significa cambio instantáneo ni migración sin trabajo operativo.

## Contratos y datos afectados

No modifica frontmatter, `contract_version`, URLs actuales ni privacidad. Establece el límite de despliegue de `ARQ-4`; los adaptadores concretos deben cumplir las reglas de redirección, cabeceras y preview aprobadas para el sitio.

## Criterios de aceptación

- **CA-1** Una sola ejecución de build produce `dist/` estático consumible por los proveedores de la matriz de `ADR-002`.
- **CA-2** El código de páginas y contenido no importa SDK/API de hosting ni requiere bindings de runtime.
- **CA-3** Cada configuración específica de proveedor puede retirarse o sustituirse sin modificar esquemas, fixtures editoriales o rutas canónicas.
- **CA-4** Una migración documentada verifica página inicial, catálogo, obra/capítulo, 404, redirects, headers, canonical y RSS antes de cambiar DNS/promover.
- **CA-5 (negativo)** No se afirma cero downtime ni equivalencia de capacidades que el proveedor de destino no soporte.

## Casos de error

Si el proveedor de destino no puede servir el artefacto o reproducir redirects/headers requeridos, la migración no se completa hasta añadir un adaptador válido o elegir otro destino.

## Riesgos y evidencia que los invalidaría

- La portabilidad puede degradarse si se incorporan funciones del proveedor. Revisar dependencias e imports durante ADR y PR.
- Un adaptador no garantiza compatibilidad absoluta; `CA-4` se comprueba con el sitio real antes de cambiar tráfico.

## Preguntas abiertas

| Pregunta | Quién responde | ¿Bloquea? |
|---|---|---|
| ¿Qué proveedor se utiliza primero y qué cuenta/plan está disponible? | Propietario/a | Para aceptar `ADR-002`, no para esta política |

## Trazabilidad (se completa al implementar)

| Criterio | Prueba / verificación | PR / commit |
|---|---|---|
| CA-1…CA-5 | Aplicar en inicialización y verificar en la primera migración (`LU-G-L`) | — |

## Pendientes y limitaciones registradas

- Ningún proveedor inicial queda elegido en esta SPEC.
- Cambiar proveedor requiere operaciones específicas de cuenta, DNS/TLS, secrets y redirects/headers y puede causar una ventana de transición.
