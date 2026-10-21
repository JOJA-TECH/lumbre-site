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

Candidatos para el aviso público de asistencia de IA (propuesta — pendiente de aprobación):

- **Propuesta A (breve):** «Algunos textos de este sitio contaron con asistencia de herramientas de IA y fueron revisados y aprobados por una persona antes de publicarse.»
- **Propuesta B (detallada):** «Parte de las historias de Lumbre se redactaron con asistencia de herramientas de IA como apoyo de escritura. Cada texto publicado fue revisado íntegramente por una persona, que corrigió y aprobó la versión final. La nota se muestra en las obras a las que aplica.»

## Exactitud y contenido

Las obras son ficción. El proceso de revisión comprobará que el texto corresponda a la intención editorial, que no exponga por accidente información privada y que el título, resumen, etiquetas y metadatos describan la pieza. Advertencias de contenido y categorías editoriales se definirán antes de publicar material que las requiera.

Categorías y advertencias editoriales propuestas (propuesta — pendiente de aprobación):

- **Violencia:** aplicar cuando la pieza describa violencia explícita o gráfica (combate, lesiones, muerte) de forma detallada; no aplicar a menciones pasajeras.
- **Contenido sensible:** aplicar cuando la pieza aborde de forma explícita o central muerte, duelo, enfermedad grave, salud mental o maltrato.
- **Temas que requieren advertencia específica:** aplicar siempre que aparezcan autolesión, suicidio, abuso o violencia sexual o de género; la advertencia debe ser visible antes del texto afectado.

Criterio general propuesto: la advertencia se aplica cuando el tema es explícito o central en la pieza, no cuando solo se menciona de pasada; se coloca antes del texto (en la obra o en el capítulo afectado) y usa una etiqueta breve y descriptiva. La lista definitiva y el formato de la advertencia los decide el propietario.

## Correcciones y cambios

- Errores tipográficos o de formato pueden corregirse manteniendo el identificador público `uid`.
- Una corrección sustantiva debe actualizar `updated` y dejar constancia editorial según el mecanismo que se defina en F3/F4.
- Un cambio de `slug` no debe romper enlaces existentes: se conserva el `uid`, se registra la URL anterior y se verifica la redirección permanente conforme a `ADR-003`.
- Una retirada requiere un cambio revisado que deje constancia del motivo editorial sin alterar otros capítulos.

Formato público del historial de correcciones (propuesta — pendiente de aprobación): una tabla con columnas `fecha | obra/capítulo | uid | tipo de corrección | descripción breve`, alimentada del mismo contenido validado que produce las páginas.

Proceso de retirada propuesto (propuesta — pendiente de aprobación): el capítulo pasa a estado editorial `retirado` con una nota visible que explique el motivo editorial sin exponer datos privados, y se aplica `git revert` al cambio del capítulo sin alterar otros capítulos, conforme a PUB-2 y `ADR-INT-002`.

## Recepción de material y participación

Lumbre no acepta actualmente envíos de lectores, comentarios ni colaboración multi-autor. No se debe enviar manuscrito privado por canales improvisados ni copiarlo a este repositorio. Si en el futuro se aceptan colaboraciones o comentarios, se requerirán una SPEC, un proceso de permisos/revisión y una evaluación de privacidad y moderación.

## Pendientes antes de publicarla

Decisiones que solo el propietario puede tomar:

- Aprobar el texto de esta política y elegir los avisos propuestos (aviso de asistencia de IA, propuesta A o B, y su ubicación).
- Aprobar las categorías y advertencias editoriales definitivas a partir de la propuesta.
- Confirmar la identidad de quien toma la decisión editorial.

La revisión de coherencia con las páginas públicas de privacidad y “Sobre Lumbre” durante F2 no requiere decisión del propietario: sigue siendo parte del flujo de F2.
