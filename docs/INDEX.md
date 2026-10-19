# Índice de trazabilidad — Lumbre

Fuente de criterios: [`ROADMAP.md`](../ROADMAP.md). Los criterios solo se marcan cumplidos al enlazar prueba o evidencia revisada.

| ID | Título | Estado | Cubre | ADR | PR |
|---|---|---|---|---|---|
| SPEC-001 | Cierre de evidencia F0 y cobertura de fixtures `PUB-3` | Aprobada | `LU-F0-S1…S5`, `INT-1` | `ADR-INT-003` (aceptado) | — |
| SPEC-002 | Decisiones base de framework, URLs y hosting | Aprobada | `LU-F0-S1`, `LU-F0-S3…S4`, `LU-G-L` | `ADR-001`, `ADR-002`, `ADR-003`, `ADR-004` (aceptados) | — |
| SPEC-003 | Agnosticismo al proveedor y migración de hosting | Aprobada | `ARQ-4`, `LU-F0-S1`, `LU-G-L` | `ADR-004` (aceptado) | — |
| SPEC-004 | Elección inicial de hosting: Cloudflare Workers static assets | Aprobada | `LU-F0-S1`, `LU-G-L`, `ARQ-4` | `ADR-002` (aceptado) · `ADR-004` | — |
| SPEC-005 | Base estática y colecciones de contenido | Verificada | `LU-F0-S4`, `LU-F2-S4`, `ARQ-1`, `ARQ-2`, `ARQ-4` | `ADR-001`, `ADR-002`, `ADR-004`, `ADR-INT-001` | — |
| ADR-INT-001 | Contrato de contenido v1 (obra y capítulo) | Aceptado | `LU-F0-S2`, `LU-F0-S5`, `AT-F0-S1`, `AT-F0-S2`, `INT-1` | — | — |
| ADR-INT-002 | Estados editoriales vs. estados de despliegue; promoción manual | Aceptado | `LU-F0-S1`, `LU-F1-S1`, `INT-2`, `INT-3` | `ADR-INT-001` | — |
| ADR-INT-003 | Cobertura de fixtures de publicación para `PUB-3` | Aceptado | `LU-F0-S2`, `LU-F0-S5`, `LU-F1-S1…S4` | `ADR-INT-001` | — |
| ADR-001 | Framework y modo de renderizado | Aceptado | `LU-F0-S4`, `LU-F2-S4`, `ARQ-1`, `ARQ-4` | `SPEC-002` | — |
| ADR-002 | Hosting y flujo de previews | Aceptado | `LU-F0-S1`, `LU-G-L`, `R-LU-03` | `SPEC-004`, `ADR-004` | — |
| ADR-003 | URLs públicas, slug y redirecciones | Aceptado | `LU-F0-S3`, `LU-F3-S5`, `CON-5`, `INT-4` | `SPEC-002` | — |
| ADR-004 | Agnosticismo al proveedor y cambio de hosting | Aceptado | `ARQ-4`, `LU-F0-S1`, `LU-G-L` | `SPEC-003` | — |

No hay PRs ni pruebas de implementación registrados todavía. `SPEC-001` y `ADR-INT-003` siguen propuestos y no autorizan cambios en fixtures del contrato.
