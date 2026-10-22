# ROADMAP — Lumbre (`lumbre-site`)

> Qué se construye, en qué orden y con qué evidencia se da por cumplido. Las **reglas de trabajo** están en [`AGENTS.md`](AGENTS.md).
> Última revisión: 2026-10-21 · Las fases son una **secuencia**, no un calendario: una fase avanza solo cuando cumple sus criterios de salida.

## 1. Cómo leer este documento

| Prefijo | Significa | Ejemplo |
|---|---|---|
| `LU-Fx-Sy` | Criterio de salida número *y* de la fase *x* | `LU-F1-S2` |
| `LU-G-X` | Puerta de decisión | `LU-G-A` |
| `R-LU-nn` | Riesgo | `R-LU-01` |
| `H-LU-nn` | Hipótesis aún no verificada | `H-LU-02` |
| `INT-n` | Hito de integración con Atelier (**definición canónica en este documento**) | `INT-2` |
| `ADR-NNN` / `ADR-INT-NNN` | Decisión. Las `INT` (contrato, estados) viven en este repo | |

**Estados de una decisión:** `Decidida` · `Propuesta` · `Hipótesis` (depende de evidencia futura, con fase donde se verifica).

## 2. Vista Now / Next / Later

| Horizonte | Fases | Foco |
|---|---|---|
| **Now** | F0 | Contrato, schema, fixtures y decisiones que obligarían a rehacer el sitio |
| **Next** | F1, F2 | Publicación segura (validación + CI) y lectura completa |
| **Later** | F3, F4 | Descubrimiento (RSS/SEO) y mejoras de lectura por fricción |
| **Condicionadas** | C1, C2, C3 | Comentarios, analítica, Nivel 2: solo si se activan sus puertas |

Un solo frente activo por vez. Hito previo al lanzamiento: **Puerta `LU-G-L`**.

**Estado al 2026-10-21:** Cierre C0 de F0 ejecutado: políticas editorial y de privacidad aprobadas en texto (aviso de asistencia de IA: opción B), propuesta de nombre y dominio candidato documentada (`docs/name-and-domain.md`), contradicción del índice de trazabilidad resuelta y manifiesto `contract/SHA256SUMS` verificado (21/21 hashes). Sigue parcial `LU-F0-S5/INT-1` (mirror de fixtures y cobertura en Atelier) y faltan identidad/contacto del responsable para publicar políticas. Ciclo C1 en ejecución: `SPEC-006` (validador de contenido + CI) aprobada por instrucción del propietario.

## 3. Riesgos

| ID | Riesgo | Evidencia que lo invalidaría | Se verifica en |
|---|---|---|---|
| R-LU-01 | Que un borrador, metadato interno o export incorrecto llegue a producción | Staging, schema estricto, preview, revisión de diff y verificación posterior funcionan con contenido real | `LU-F1-S1…S5`, `INT-3` |
| R-LU-02 | Construir comunidad, cuentas y analítica antes de una lectura sólida | Datos de lectura recurrente y problemas concretos que exijan esas capacidades | `LU-G-C`, `LU-G-D` |
| R-LU-03 | Fijar dominio, marca o proveedor sin verificar | Disponibilidad, cuenta, límites y condiciones comprobados antes del lanzamiento | `LU-G-L` |
| R-LU-04 | Contrato duplicado o divergente entre Atelier y Lumbre | Una sola fuente (`contract/`), copia fijada con hash en Atelier, fixtures compartidas | `INT-1`, `INT-2` |
| R-LU-05 | Romper URLs ya compartidas al corregir un capítulo o cambiar un slug | Redirecciones y `uid` estable probados en un cambio real | `INT-4` |

## 4. Hipótesis y decisiones iniciales

| ID | Tema | Estado | Detalle |
|---|---|---|---|
| — | Lumbre es la plataforma pública de lectura de DeepWrite; Nivel 1 = relatos, seriales, RSS, navegación, búsqueda básica, páginas editoriales | Decidida | |
| — | Contenido en Markdown con frontmatter, versionado en Git | Decidida | `ADR-INT-001` |
| — | Repositorio `lumbre-site` | Decidida | |
| H-LU-01 | Framework Astro en modo estático + Content Collections | Decidida | Astro 7 estático, `ADR-001`; dependencias actualizadas con pnpm el 2026-10-15 |
| H-LU-02 | Hosting inicial | Decidida | Cloudflare Workers static assets, `ADR-002`; confirmar cuenta, plan y límites antes de lanzamiento (`LU-G-L`) |
| H-LU-03 | Nombre “Lumbre” y dominio | Hipótesis | Provisional; se cierra en `LU-G-L`. **No bloquea el desarrollo** |
| — | Comentarios y analítica | Diferidos | C1 y C2, separados del manuscrito |
| H-LU-04 | Monetización publicitaria | Diferida | Explorar de nuevo después de F2 y de tener audiencia/lectura observables; requiere SPEC + ADR, revisión de privacidad, políticas del proveedor y aprobación antes de cualquier script. Investigación inicial: AdSense puede aceptar contenido asistido por IA con revisión/curaduría, sujeto a revisión del sitio; anuncios contextuales implican rastreo del contenido público y datos/cookies del lector. |
| — | Agnosticismo al proveedor y posibilidad de migración | Decidida | `ADR-004`: mismo `dist/` estático; configuración/adaptadores aislados; el cambio requiere validar despliegue, DNS y comportamiento HTTP |

**Nota sobre H-LU-02 (revisada 2026-10-15).** Se eligió Cloudflare Workers static assets como hosting inicial. La documentación oficial describe `_redirects`, `_headers` y previews por rama/PR con Workers Builds; antes del lanzamiento hay que verificar cuenta, límites, flujo de revisión y redirecciones reales. La comparación cruzada y sus fuentes quedan en `ADR-002`; `ADR-004` mantiene explícita la posibilidad de migrar de proveedor.

## 5. Reglas de planificación

1. **Qué sale.** Todo ítem nuevo declara qué se pospone o elimina.
2. **Dominio y marca no bloquean el build**; bloquean solo el lanzamiento público (`LU-G-L`).
3. **Cada elemento de F4 y toda fase condicionada necesita evidencia:** fricción observada o pregunta editorial concreta, documentada en su SPEC.
4. **Revisión en lotes** (al cerrar cada fase o mensualmente); los cambios se anotan en §10.
5. **Una fase cuenta como cumplida** solo si cada criterio tiene prueba o evidencia enlazada.
6. **El hosting es intercambiable:** una selección inicial no es compromiso permanente; el sitio conserva el contrato agnóstico de `ADR-004` y verifica cada migración.

## 6. Fases

### F0 — Contrato, identidad y operación · *Now*
**Objetivo:** cerrar los límites que obligarían a rehacer el sitio, con el contrato ya ejecutable.

**Entregables:** README · `AGENTS.md` · plantillas SPEC/ADR · `contract/` (JSON Schema v1 + obra/capítulo) · **fixtures**: relato válido, serial de ≥3 capítulos, y un caso inválido por cada regla `PUB-3` · schema de Content Collections derivado del contrato · política mínima de privacidad · política editorial y de correcciones · nombre provisional y dominio candidato documentados.
**ADR:** modo estático y framework · hosting · URLs, slugs y política de cambio de slug (con `uid`) · `ADR-INT-001` contrato v1 · `ADR-INT-002` estados editoriales vs. estados de despliegue y promoción manual.

| ID | Criterio de salida |
|---|---|
| LU-F0-S1 | El contenido de producción se distingue de staging (rama/carpeta documentada) |
| LU-F0-S2 | Los campos privados están excluidos por schema estricto con lista permitida (`CON-3`) |
| LU-F0-S3 | Existe estrategia escrita para no romper URLs publicadas |
| LU-F0-S4 | Ninguna integración externa es requisito oculto del build |
| LU-F0-S5 | Contrato v1 acordado con Atelier y fixtures compartidas (**INT-1**) |

**Revisión de evidencia de F0 (2026-10-15)**

| Criterio | Estado | Evidencia / brecha |
|---|---|---|
| LU-F0-S1 | Verificado | `ADR-INT-002`, `SPEC-005` y README distinguen PR/previews como staging y `main` como producción con revisión humana antes del merge. Conectar Workers Builds queda para la configuración operativa, no bloquea este criterio documental de F0. |
| LU-F0-S2 | Verificado localmente | `contract/v1/obra.schema.json`, `capitulo.schema.json` y `publicacion.schema.json` rechazan propiedades adicionales; hay fixture de campo desconocido. |
| LU-F0-S3 | Verificado | `ADR-003` aceptado: fija rutas `/obras/{work}/` y `/obras/{work}/{slug}/`, conserva `uid` estable y exige redirección permanente desde un registro independiente del proveedor. El formato portable y la prueba real corresponden a F3 / `INT-4`. |
| LU-F0-S4 | Verificado | `astro check` pasó con 0 errores/warnings/hints y `astro build` generó salida `static` sin integraciones externas. Aún no hay rutas ni páginas (0 páginas construidas), propio de F0. |
| LU-F0-S5 / INT-1 | Parcial | `ADR-INT-001` y `ADR-INT-003` aceptados; matriz y diez casos sintéticos nuevos en `contract/v1/fixtures/lumbre-only/`. La copia Atelier sigue con el paquete base de diez archivos y no se modificó; hace falta sincronizar hash y acordar/implementar cobertura equivalente en su validador. |

### F1 — Validación y publicación segura · *Next*
**Objetivo:** que sea imposible publicar algo incorrecto, antes de construir más interfaz.

**Alcance:** validador de contenido (CLI) · integración con Content Collections · verificación de slug y orden de serial · control de estado · CI que ejecuta validación + build · flujo PR de staging con diff · detector de secretos/rutas locales/prompts · procedimiento de reversión por Git.

| ID | Criterio de salida |
|---|---|
| LU-F1-S1 | Un capítulo en `borrador` o `buffer` hace fallar el build de producción |
| LU-F1-S2 | Un slug duplicado detiene el build |
| LU-F1-S3 | Un capítulo sin datos obligatorios o con campos desconocidos detiene el build |
| LU-F1-S4 | El contenido no contiene prompts, IDs internos, rutas locales ni claves (probado con fixtures inválidas) |
| LU-F1-S5 | Revertir un capítulo con Git no altera otros capítulos (probado) |
| LU-F1-S6 | Un export de Atelier en staging pasa o falla correctamente el validador (**INT-2**) |

### F2 — Shell editorial y lectura · *Next*
**Objetivo:** leer un relato completo y navegar el catálogo.

**Alcance:** layout global · inicio · catálogo · página de relato · índice de serial · página de capítulo · navegación anterior/siguiente · “sobre el proyecto” · privacidad · tipografía y modo de lectura · responsive · metadatos básicos.
**Organización:** `src/features/{reading,catalog,serials,editorial,navigation,privacy}/` (`ARQ-2`).
**SPEC de entrada:** fija el presupuesto de rendimiento y el objetivo de accesibilidad (propuesta: WCAG 2.2 AA en rutas principales).

| ID | Criterio de salida |
|---|---|
| LU-F2-S1 | Un lector llega de inicio → relato → capítulo → capítulo siguiente sin enlaces rotos |
| LU-F2-S2 | Se lee correctamente en pantalla pequeña y de escritorio |
| LU-F2-S3 | Las páginas funcionan sin comentarios ni analítica |
| LU-F2-S4 | El build genera HTML estático reproducible |
| LU-F2-S5 | Rutas principales cumplen el objetivo de accesibilidad fijado en la SPEC |

### F3 — RSS, sitemap y SEO técnico · *Later*
**Objetivo:** hacer descubrible y suscribible el contenido publicado.

**Alcance:** RSS global y por serial · sitemap · robots · canonical · Open Graph (sin etiquetas `twitter:*` salvo necesidad demostrada) · JSON-LD editorial cuando aporte · 404 · redirecciones documentadas.
**ADR:** formato y alcance de feeds · política de URLs canónicas · estrategia de cambio de slug (si no cerrada en F0).

| ID | Criterio de salida |
|---|---|
| LU-F3-S1 | El feed excluye borradores |
| LU-F3-S2 | Cada entrada tiene fecha, título, enlace y descripción válidos |
| LU-F3-S3 | El sitemap contiene solo URLs públicas |
| LU-F3-S4 | Las rutas principales tienen metadata coherente |
| LU-F3-S5 | Corregir un capítulo publicado o cambiar su slug conserva la URL antigua vía redirección (**INT-4**) |

### F4 — Calidad editorial y experiencia de lectura · *Later*
**Objetivo:** mejorar la lectura sin añadir complejidad de plataforma.

**Candidatas (cada una exige SPEC con fricción observada):** búsqueda local en catálogo · filtros por serie/tipo/etiqueta · tabla de contenidos del serial · progreso local sin cuenta · modo oscuro · tamaño de fuente · comportamiento documentado de copia/selección · página de correcciones y changelog editorial.

| ID | Criterio de salida |
|---|---|
| LU-F4-S1 | Las mejoras no rompen canonical, RSS ni URLs existentes |
| LU-F4-S2 | La navegación funciona con JavaScript desactivado cuando la característica no lo requiere |
| LU-F4-S3 | Rendimiento y accesibilidad se mantienen dentro del presupuesto definido en F2 |

## 7. Fases condicionadas

No se planifican ni se crean carpetas hasta que su puerta se abra.

### C4 — Monetización publicitaria · Hipótesis diferida `H-LU-04`
**Revisión:** después de F2, cuando existan páginas publicadas y señales de audiencia. La comparación preliminar favorece evaluar AdSense como experimento inicial; no constituye una elección ni autorización de integración. Antes de activar C4 se requiere SPEC y ADR N2 que documenten datos transmitidos (incluido análisis de texto de páginas con anuncios), privacidad/consentimiento por región, contenido admisible, ubicación de espacios, economía esperada y método de retirada. No añadir scripts, CMP, `ads.txt` ni SDKs mientras siga diferida.

### C1 — Comentarios · Puerta `LU-G-C`
**Entrada:** lectores recurrentes + decisión de moderación + aceptación explícita de la dependencia de GitHub si se elige Giscus.
**Alcance posible:** Giscus, categoría de Discussions, mapeo por pathname, normas de comunidad, *fallback* si el script falla.
**ADR:** proveedor · identidad y OAuth · moderación · privacidad y datos transmitidos.
**Salida:** `LU-C1-S1` el sitio es legible si comentarios no carga · `LU-C1-S2` no recibe contenido privado de Atelier · `LU-C1-S3` existe proceso de moderación y retirada.

### C2 — Analítica · Puerta `LU-G-C`
**Entrada:** una pregunta editorial concreta que no pueda responderse con señales cualitativas.
**Alcance posible:** páginas vistas agregadas, lectura por obra/capítulo, referencias, suscripción RSS si aplica.
**Límites:** no enviar texto de historias · no vincular comportamiento a identidad si no es imprescindible · documentar scripts, cookies, retención y propósito (`PRI-1…3`).

### C3 — Revisión de Nivel 2 · Puerta `LU-G-D`
**Evidencia mínima:** lectores recurrentes · problemas concretos no resolubles con sitio estático · necesidad editorial demostrada de cuentas/suscripciones/personalización · modelo de privacidad y moderación viable · costo operativo aceptable.
Si no existe, Lumbre permanece como portafolio y sitio editorial personal. **Eso no es un fracaso.**

## 8. Puertas de decisión

| ID | Pregunta | Regla |
|---|---|---|
| LU-G-A | ¿La publicación es segura? | Si el build permite que un borrador llegue a producción, no se añade automatización |
| LU-G-B | ¿La lectura es sólida? | Si navegación, responsive o contenido fallan, se detienen SEO avanzado, comentarios y analítica |
| LU-G-C | ¿La integración está justificada? | Si ninguna pregunta concreta la requiere, no entra al roadmap |
| LU-G-D | ¿Hace falta plataforma dinámica? | Sin lectores recurrentes y necesidades no resolubles de forma estática, no se construye backend, autenticación ni pagos |
| **LU-G-L** | **¿Se puede lanzar públicamente?** | Dominio y marca verificados (`H-LU-03`) · cuenta y límites del hosting comprobados (`H-LU-02`) · política de privacidad y editorial publicadas · una publicación real completa en producción verificada (**INT-3**) |

## 9. Hitos de integración (definición canónica)

| Hito | Definición | Depende de |
|---|---|---|
| **INT-1** | Contrato v1 acordado (`ADR-INT-001`) con fixtures compartidas | Lumbre F0 · Atelier F0 |
| **INT-2** | Un export real de Atelier a staging es validado correctamente (aceptado o rechazado) por el validador de Lumbre | Lumbre F1 · Atelier F3 |
| **INT-3** | Primera publicación real extremo a extremo, con revisión humana del diff y verificación posterior de URLs, RSS y canonical | Lumbre F2 (y F3 para RSS) · Atelier F3 |
| **INT-4** | Corrección o cambio de slug de un capítulo ya publicado sin romper URL ni feed | Lumbre F3 · Atelier F3 |

**Orden sugerido para un solo desarrollador:** F0 de ambos repos en paralelo (contrato) → Atelier F1 (hay que poder escribir) → Lumbre F1 → Lumbre F2 → Atelier F3 → Lumbre F3.

## 10. Fuera de alcance actual (Nivel 1)

Multi-autor · cuentas · perfiles · pagos · suscripciones propias · mensajes privados · recomendaciones personalizadas · editor online · marketplace · moderación compleja · almacenamiento del manuscrito original.

## 11. Registro de cambios del roadmap

| Fecha | Cambio | Motivo | Qué se pospuso |
|---|---|---|---|
| 2026-10-13 | Reescritura: IDs de trazabilidad; contrato y fixtures movidos a F0; **validación/CI (antes “Fase 2”) adelantada a F1**, antes de la interfaz; comentarios, analítica y Nivel 2 agrupados como fases condicionadas; añadidas Puerta `LU-G-L` e hitos `INT`; nota de hosting actualizada | El riesgo principal es publicar algo incorrecto; el contrato debe ser ejecutable antes que el shell | — |
| 2026-10-15 | Revisión de evidencia F0; creado índice; propuestas SPEC-001/002 y ADR-001/002/003/INT-003; corregido el estado de v1 y actualizada la nota de hosting con fuentes oficiales | Contrastar el roadmap con el repositorio y documentación vigente de proveedores/framework | Aprobación humana de SPEC/ADR; evidencia Atelier; implementación de F1 tras cerrar F0 |
| 2026-10-15 | Aprobados `SPEC-003` y `ADR-004`: contrato de despliegue agnóstico al proveedor y migración posible sin rehacer contenido ni lógica editorial | Instrucción explícita del propietario; formaliza `ARQ-4` | Cada proveedor requiere su adaptador/configuración, validación y transición operativa |
| 2026-10-15 | Aprobada `SPEC-004` y aceptado `ADR-002`: Cloudflare Workers static assets como proveedor inicial | Elección explícita del propietario | Confirmar cuenta/plan y verificar previews, redirects y headers antes de lanzamiento |
| 2026-10-15 | Registrada `H-LU-04` y C4 como hipótesis publicitaria diferida; añadidas recomendaciones concretas pendientes de aprobación a `ADR-001` (Astro 6 estático) y `ADR-003` (`/obras/{work}/{slug}/`) | Mantener el análisis de Ads para después de F2 y preparar el cierre de decisiones de F0 antes de crear la app | Sin integración Ads ni emisión de URLs públicas; framework y rutas esperan aprobación humana |
| 2026-10-15 | Aceptados `ADR-001` (Astro 6 estático) y `ADR-003` (rutas bajo `/obras/`) por aprobación explícita del propietario; aprobada `SPEC-002` | Cerrar decisiones base de F0 para comenzar la implementación ordenada | Cuenta/plan Cloudflare sigue para `LU-G-L`; SPEC-001/ADR-INT-003 y evidencia Atelier siguen pendientes |
| 2026-10-15 | Aprobada `SPEC-005`: base Astro estática, colecciones estrictas derivadas del contrato y configuración Workers aislada; inicia F0 de implementación | Autorización explícita del propietario para crear el sitio fase por fase | Fixtures completas y acuerdo Atelier, políticas editorial/privacidad y validación F1 siguen pendientes |
| 2026-10-15 | Verificada en modo lectura la copia de contrato v1 en Atelier: la lista de hashes coincide con los diez archivos fuente; actualizado `LU-F0-S5/INT-1` como parcial, no completado | Ruta de Atelier proporcionada por el propietario; repositorio informa F0 completada | Completar fixtures `PUB-3` de Lumbre y conservar el checkout Atelier sin modificaciones |
| 2026-10-15 | Actualizados los paquetes del sitio con pnpm a versiones estables recientes; `ADR-001` y `SPEC-005` pasan de Astro 6 a Astro 7 por petición explícita del propietario; TypeScript queda en 6.0.3 porque Astro Check rechaza 7.0.2; corregido el inventario de contrato Atelier a diez archivos | Solicitud de usar pnpm y actualizar dependencias, con consulta de fuentes vigentes | Validación local Astro 7 y cierre de CA de SPEC-005 pendientes |
| 2026-10-15 | Verificada `SPEC-005`: lockfile congelado al día, Astro Check sin diagnósticos, build estático exitoso (0 páginas en esta fase), schemas estrictos probados en memoria y configuración Workers aislada; `LU-F0-S4` pasa a verificado | Completar la verificación local autorizada tras el cambio de dependencias | F0 conserva brechas en fixtures, políticas editorial/privacidad, política de slug/redirecciones y `INT-1`; F2 aún debe crear las páginas. Auditoría de vulnerabilidades pendiente |
| 2026-10-15 | Aprobadas `SPEC-001` y `ADR-INT-003` tras «continua»; añadido el grupo sintético `lumbre-only`, manifiesto SHA-256 fuente verificado (21 archivos) y borradores internos editorial/privacidad | Continuar F0 sin editar el checkout Atelier ni atribuirle reglas que su autotest no valida; preparar documentación sin publicarla con datos del responsable o configuración sin confirmar | Sincronización/hash y reglas adicionales con Atelier; aprobación y datos de contacto/configuración para políticas; revisión humana de dominio provisional |
| 2026-10-21 | Ejecutado el cierre C0 de F0 con `docs/EXECUTION-PLAN.md`: aprobadas en texto las políticas editorial y de privacidad (aviso de IA: opción B), propuesta de nombre/dominio creada, contradicción de `docs/INDEX.md` resuelta y manifiesto `SHA256SUMS` verificado (21/21); aprobada `SPEC-006` y ejecutándose el ciclo C1 (validador + CI) | Instrucción explícita del propietario (aprobación de políticas y «continua» del plan) | Mirror de fixtures y cobertura en Atelier (`INT-1`), identidad/contacto del responsable, verificación de dominio en `LU-G-L`, prueba real de reversión con primer contenido (`LU-F1-S5`, `INT-2`) |
| 2026-10-22 | C1 completado (validador 17/17 fixtures, CI definido, flujo de publicación documentado) y C2a ejecutado: `SPEC-007` aprobada; tokens «Papel frío, tinta y brasa» con contraste AA verificado por script (`test:a11y` integrado al CI), layout global accesible con 0 JS de cliente y dirección de diseño documentada | Instrucción del propietario («continúa», aprueba SPEC-007); skills de UX/UI instaladas en `.opencode/skills/` | CI sin primer run real hasta pushear; páginas reales en C2b; `LU-F1-S5/S6` y `INT-2` esperan contenido/Atelier; persona lectora es hipótesis sin validar con usuarios |
