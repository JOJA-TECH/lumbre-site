# Política editorial — borrador interno

- **Estado:** Borrador; pendiente de aprobación del propietario
- **Fecha:** 2026-10-15
- **Alcance:** relatos y novelas serializadas publicadas por Lumbre

> Este documento guía una futura publicación; no autoriza incluir historias en `content/` ni sustituye la revisión humana de cada PR.

## Creación y revisión

- Cada historia parte de una solicitud e intención editorial humana. No se generan ni publican historias automáticamente.
- Las herramientas de IA pueden asistir en la redacción; una persona revisa el texto completo, corrige y decide si se publica.
- Solo una pieza aprobada por el propietario puede entrar al flujo de publicación con `status: publicado`.
- Prompts privados, respuestas de modelos sin revisar, logs, IDs internos, rutas locales y claves no forman parte de una exportación pública.

## Transparencia sobre IA

Las historias pueden incluir asistencia de IA y revisión humana. El texto exacto y la ubicación de una nota pública de procedencia quedan pendientes de decisión editorial. Hasta decidirlo, no se debe afirmar que una historia fue escrita exclusivamente por una persona ni diseñar una etiqueta pública en nombre del propietario.

## Exactitud y contenido

Las obras son ficción. El proceso de revisión comprobará que el texto corresponda a la intención editorial, que no exponga por accidente información privada y que el título, resumen, etiquetas y metadatos describan la pieza. Advertencias de contenido y categorías editoriales se definirán antes de publicar material que las requiera.

## Correcciones y cambios

- Errores tipográficos o de formato pueden corregirse manteniendo el identificador público `uid`.
- Una corrección sustantiva debe actualizar `updated` y dejar constancia editorial según el mecanismo que se defina en F3/F4.
- Un cambio de `slug` no debe romper enlaces existentes: se conserva el `uid`, se registra la URL anterior y se verifica la redirección permanente conforme a `ADR-003`.
- Una retirada requiere un cambio revisado que deje constancia del motivo editorial sin alterar otros capítulos.

## Recepción de material y participación

Lumbre no acepta actualmente envíos de lectores, comentarios ni colaboración multi-autor. No se debe enviar manuscrito privado por canales improvisados ni copiarlo a este repositorio. Si en el futuro se aceptan colaboraciones o comentarios, se requerirán una SPEC, un proceso de permisos/revisión y una evaluación de privacidad y moderación.

## Pendientes antes de publicarla

- Aprobar el texto y definir cómo se identifica a quien toma la decisión editorial.
- Decidir el aviso público de asistencia de IA.
- Definir categorías y advertencias editoriales para obras que las necesiten.
- Acordar formato público de historial de correcciones y proceso de retirada.
- Revisar coherencia con las páginas públicas de privacidad y “Sobre Lumbre” durante F2.
