# AGENTS.md — Lumbre (`lumbre-site`)

> Instrucciones operativas para agentes y colaboradores. Contiene **reglas**, no estado ni planes.
> Estrategia, fases y criterios de salida: [`ROADMAP.md`](ROADMAP.md). Plantillas: `docs/templates/`.
> Última revisión: 2026-10-13

## 1. Qué es este repositorio

Sitio público de lectura de relatos y novelas serializadas exportados desde **deepwrite-atelier**. Nivel 1: sitio editorial **estático**, versionado en Git, construido desde Markdown con frontmatter.

- Stack previsto: Astro en modo estático + Content Collections. *(Propuesta hasta ADR de framework.)*
- Lumbre **es dueño del contrato de contenido**: Atelier se ajusta a él (`ADR-INT-001`).
- Fuera del Nivel 1: cuentas, perfiles, pagos, colaboración, mensajes privados, multi-autor. Requieren otra SPEC, otro modelo de amenazas y posiblemente otra arquitectura (Puerta `LU-G-D`).
- Lo que no esté en este archivo, el ROADMAP o un ADR aceptado **no está decidido**: pregunta.

## 2. Mapa documental

| Ruta | Contiene | Quién la actualiza |
|---|---|---|
| `ROADMAP.md` | Fases, criterios (`LU-Fx-Sy`), riesgos, puertas, hitos `INT-n` | Humano; el agente propone cambios |
| `docs/specs/SPEC-NNN-*.md` | Comportamiento observable de un incremento | Agente + aprobación humana |
| `docs/decisions/ADR-NNN-*.md` · `ADR-INT-NNN-*.md` | Decisiones y alternativas descartadas | Agente + aprobación humana |
| `docs/templates/` | Plantillas SPEC y ADR | Humano |
| `docs/INDEX.md` | Tabla de trazabilidad (ver §9) | Agente, en el mismo PR |
| `contract/` | Fuente del contrato: JSON Schema, versión, fixtures válidas e inválidas | Solo con ADR |
| `content/` | **Solo** contenido aprobado para publicar | Importación desde Atelier vía PR |

## 3. Niveles de trabajo

| Nivel | Cuándo | Qué se necesita antes del código |
|---|---|---|
| **N0 — Corrección local** | Typo, enlace roto, tipado, test roto, docs inconsistentes. Sin cambio de comportamiento y diff local | Nada |
| **N1 — Cambio acotado** | Nueva página, componente o mejora que **no** cambia URLs, contrato, privacidad ni despliegue | Mini-SPEC (Problema, Alcance, Fuera de alcance, Criterios de aceptación) aprobada |
| **N2 — Cambio estructural** | Toca contrato/frontmatter, URLs/slugs/canonical/RSS, hosting, scripts externos, datos del lector, o contradice un ADR | SPEC completa **y** ADR aceptado, con aprobación humana |

**Publicar o modificar una historia** es siempre un flujo propio (§6), nunca una tarea de código.

## 4. Ciclo de trabajo (N1 y N2)

1. **Spec** — comportamiento observable y criterios numerados (`CA-1…`).
2. **Decide** — revisar ADR; crear/actualizar si procede.
3. **Plan** — rutas, componentes, contenido, pruebas, riesgos.
4. **Test** — cada `CA-n` con prueba o verificación documentada, antes o junto con el código.
5. **Implement** — solo el alcance aprobado.
6. **Verify** — validación de contenido, typecheck, build, enlaces, pruebas aplicables, revisión del diff generado.
7. **Record** — actualizar SPEC, ADR, `docs/INDEX.md` y changelog.

## 5. Reglas del repositorio

### Contenido y contrato
- **CON-1** `content/` solo recibe contenido aprobado. Nunca manuscritos privados, prompts, claves, logs de generación, bases SQLite ni datos del Codex.
- **CON-2** Producción acepta únicamente `status: publicado`. Cualquier otro estado en `content/` **hace fallar el build** (no se ignora en silencio).
- **CON-3** El schema es **estricto con lista permitida**: un campo desconocido es un error. No se mantiene lista negra de campos privados.
- **CON-4** Doble validación: Atelier antes de exportar; Lumbre al importar y en CI/build.
- **CON-5** Un slug es único dentro de su obra. Las URLs publicadas no cambian salvo ADR + redirección documentada.

### Arquitectura
- **ARQ-1** Sitio estático. Pasar a SSR/backend exige ADR y pasar la Puerta `LU-G-D`.
- **ARQ-2** Código **por funcionalidad** en `src/features/<feature>/` (rutas auxiliares, componentes, tipos, validaciones y pruebas juntos). `src/pages/` solo compone y enruta. Sin `utils/`, `helpers/` o `components/` genéricos.
- **ARQ-3** `features/comments/` y `features/analytics/` deben poder eliminarse sin tocar el flujo de lectura. No se crean hasta que su fase condicionada se active.
- **ARQ-4** El resultado de `build` es un `dist/` estático **portable**: ningún código depende del proveedor de hosting. Lo específico del proveedor vive en su archivo de configuración.
- **ARQ-5** RSS y sitemap se generan del mismo contenido validado que produce las páginas.

### Privacidad y dependencias externas
- **PRI-1** Ningún texto de historias se envía a analítica, comentarios o búsqueda externa.
- **PRI-2** Un script externo solo se carga en las páginas que lo necesitan. Las páginas de lectura funcionan sin él.
- **PRI-3** Cada integración externa (p. ej. Giscus, GoatCounter) requiere ADR, lista de datos transmitidos y revisión de configuración antes de entrar.

### SEO y accesibilidad
- **SEO-1** Toda página pública tiene título, descripción, canonical, Open Graph, idioma y jerarquía de encabezados válida.
- **A11Y-1** Navegación por teclado, foco visible, contraste suficiente y lectura en pantalla pequeña. Objetivo inicial propuesto: WCAG 2.2 AA en rutas principales (se confirma en la SPEC de F2).

## 6. Flujo de publicación segura

```text
exportación de Atelier
→ PR / rama de staging
→ validación de contenido (CI)
→ revisión humana del diff
→ build + preview
→ merge a producción
→ verificación posterior (URLs, RSS, canonical)
```

- **PUB-1** Un agente **no** hace push a producción cuando el cambio publica o modifica una historia: prepara el PR y deja visible el diff.
- **PUB-2** Revertir un capítulo es un `git revert` de su cambio, sin alterar otros capítulos. Se prueba en F1.
- **PUB-3** El build **falla** ante: frontmatter inválido o con campos desconocidos · slug duplicado · serial sin `order` o con órdenes repetidos · fecha inválida o futura · estado no publicable · contenido vacío no permitido · enlaces internos rotos · campo privado.

## 7. Contrato de contenido v1 — *propuesto hasta `ADR-INT-001`*

La fuente definitiva será `contract/` (JSON Schema versionado). Hasta entonces, este es el borrador de trabajo:

**Obra** — `content/<work>/_obra.md`

| Campo | Obligatorio | Nota |
|---|---|---|
| `contract_version` | sí | entero |
| `work` | sí | slug de obra |
| `title`, `author`, `lang` | sí | `lang` ej. `es` |
| `type` | sí | `relato` \| `serial` |
| `synopsis` | sí | resumen editorial |
| `tags` | no | lista |

**Capítulo / pieza** — `content/<work>/<slug>.md`

| Campo | Obligatorio | Nota |
|---|---|---|
| `contract_version`, `work`, `slug`, `title` | sí | |
| `uid` | sí | id público opaco y estable; **no** es el ID interno de Atelier. Permite redirecciones si cambia el slug |
| `status` | sí | solo `publicado` |
| `date_published` | sí | ISO 8601, no futura |
| `order` | si `type: serial` | entero único dentro de la obra |
| `synopsis` | no | |
| `updated` | no | fecha de la última corrección publicada |
| `source_revision` | sí | hash del export en Atelier |

Cambiar nombres o semántica de campos ⇒ **ADR + nueva `contract_version`**.

## 8. Comandos y verificación

**Regla:** los comandos reales viven en `package.json` y CI. No documentes ni uses scripts que no existan.

| Verificación | Estado |
|---|---|
| Validación de frontmatter y Content Collections | pendiente de F0/F1 |
| typecheck · lint y formato | pendiente de init |
| build estático reproducible | pendiente de init |
| enlaces y rutas · RSS · canonical y metadatos | pendiente de F2/F3 |
| contenido no publicable (debe fallar) | pendiente de F1 |
| responsive y accesibilidad en rutas principales | pendiente de F2 |

## 9. Trazabilidad

Cadena obligatoria: **criterio del ROADMAP → SPEC → ADR → prueba → commit/PR**.

- Cada SPEC declara `Cubre: LU-Fx-Sy` (y `INT-n` si aplica) y sus ADR relacionados.
- Commits y PR citan el ID: `SPEC-007: navegación capítulo anterior/siguiente`. Un PR sin SPEC debe declararse N0.
- `docs/INDEX.md` mantiene `ID | título | estado | cubre | ADR | PR`.
- Un criterio del ROADMAP solo se marca cumplido enlazando prueba o evidencia.

## 10. Cuándo detenerse y pedir decisión

- Introduce cuentas, pagos o datos personales.
- Cambia de estático a SSR o backend.
- Publica contenido sin revisión humana.
- Añade un proveedor externo nuevo.
- Modifica URLs públicas ya compartidas.
- Exige afirmar disponibilidad legal de una marca o dominio.
- Necesita datos del lector no definidos en la política de privacidad.
- Cambia el contrato o contradice un ADR aceptado.

## 11. Definition of Done

- [ ] SPEC aprobada (o tarea declarada N0).
- [ ] Cada `CA-n` con prueba o verificación documentada.
- [ ] ADR afectados actualizados.
- [ ] Contenido y rutas validados; las páginas no exponen datos privados.
- [ ] Build y pruebas aplicables pasan.
- [ ] Diff generado revisado.
- [ ] `docs/INDEX.md` y changelog actualizados; límites y pendientes documentados.
