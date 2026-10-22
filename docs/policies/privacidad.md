# Política de privacidad — borrador interno

- **Estado:** Texto aprobado por el propietario (2026-10-21); NO publicar hasta completar identidad/contacto y verificar la configuración real del hosting
- **Fecha:** 2026-10-15
- **Alcance:** futura web pública estática de Lumbre

> Este texto describe el estado conocido del proyecto, no una declaración de cumplimiento legal. No se debe publicar hasta completar los datos pendientes y verificar la configuración real del proveedor.

## Estado actual del sitio

Lumbre está en desarrollo. El build produce un sitio estático vacío: todavía no hay páginas públicas, cuentas, formularios, comentarios, anuncios, analítica ni funciones de búsqueda externa. El repositorio no incluye una base de datos de lectores ni código propio para almacenar progreso o identificadores de visitantes.

Cloudflare Workers Static Assets está elegido como proveedor inicial, pero no hay cuenta, dominio ni despliegue conectado en este proyecto. Antes del lanzamiento se debe comprobar qué datos técnicos procesa la configuración seleccionada, qué registros están habilitados, cuánto tiempo se conservan y desde qué regiones se prestan los servicios. La documentación de Cloudflare describe que Workers Logs puede almacenar metadatos de invocaciones y solicitudes cuando está habilitado y que sus plazos dependen del plan/configuración; esta política no presume que esté habilitado ni que esté deshabilitado.

## Responsable y contacto

- Responsable del tratamiento: **pendiente de completar con el nombre o razón social de quien opere Lumbre**.
- Canal para consultas y reclamos sobre datos personales: **pendiente de definir y probar**.
- País y dirección de contacto, si corresponden: **pendientes de confirmar**.

No publicar esta política con campos pendientes ni inventar datos de contacto.

## Datos y finalidades previstas

Cuando el sitio se lance, su función principal será entregar páginas y archivos públicos de lectura. El proveedor de hosting podría procesar información técnica necesaria para entregar, proteger y diagnosticar las solicitudes (por ejemplo, metadatos de tráfico y solicitud). Las categorías exactas se completarán tras revisar contrato, plan, panel y configuración efectiva.

Lumbre no tiene previsto pedir cuentas, perfiles ni datos de lectores para leer historias. No se enviará el texto de las historias a analítica, comentarios o búsqueda externa. Ads, comentarios y analítica permanecen diferidos y requieren una decisión, revisión de datos transmitidos y actualización de esta política antes de integrarse.

## Cookies y almacenamiento del navegador

El código de Lumbre no implementa actualmente cookies, almacenamiento local ni identificadores de analítica. Antes de publicar se inspeccionarán las respuestas y el navegador en el entorno real para identificar cualquier cookie o almacenamiento que provenga del proveedor. Si se añade un tercero, se actualizarán esta sección y las decisiones de privacidad antes de cargar su código.

## Conservación, acceso y transferencias

Lumbre no mantiene actualmente un almacén propio de datos de lectores. La duración, ubicación y acceso a registros técnicos dependen de la configuración y condiciones del proveedor aún no contratado/verificado; deben documentarse antes del lanzamiento. No afirmar que los datos se eliminan inmediatamente ni que permanecen en un país específico hasta comprobarlo.

## Derechos y solicitudes

La persona titular podrá solicitar, según corresponda, conocer, actualizar y rectificar sus datos personales, conocer su uso, solicitar prueba de autorización cuando aplique, y pedir revocatoria o supresión en los casos legalmente procedentes. El canal, procedimiento de verificación de identidad y plazos de atención quedan pendientes de definir antes de publicar. La Ley 1581 de 2012 establece derechos de titulares y deberes para responsables y encargados; el flujo debe revisarse contra el tratamiento real de Lumbre.

Procedimiento de consultas y reclamos (aprobado 2026-10-21; debe probarse de punta a punta antes de publicar la política):

1. **Recepción:** la solicitud llega por el canal único de contacto (el definido en «Responsable y contacto», aún pendiente de completar).
2. **Acuse de recibo:** confirmación de recepción en un plazo de [placeholder].
3. **Verificación de identidad:** comprobación mínima suficiente antes de atender la solicitud, por el medio que se defina en [placeholder].
4. **Respuesta:** atención o respuesta motivada en un plazo de [placeholder], conforme a la Ley 1581 de 2012.
5. **Registro interno:** anotación con fecha de la solicitud recibida, la atención dada y la respuesta enviada.

Este procedimiento debe probarse de punta a punta (por ejemplo, con una solicitud simulada) antes de publicar la política; los plazos definitivos y el canal requieren decisión del propietario.

## Cambios y estado de publicación

Esta página interna no está lista para mostrarse a visitantes. Antes de pasarla a una ruta pública deben resolverse todos los pendientes siguientes:

- Identidad y datos de contacto del responsable.
- Cuenta, plan, condiciones y configuración real del hosting.
- Registros, cookies, regiones, proveedores secundarios y retención efectiva.
- Probar el procedimiento aprobado de consultas/reclamos, incluido el proceso de supresión/rectificación.
- Determinación aplicable sobre registros regulatorios y otras obligaciones según la situación del responsable.
- Revisión legal de la versión destinada a publicación.

## Fuentes consultadas

- [Ley Estatutaria 1581 de 2012 — Gestor Normativo de Función Pública](https://www1.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981).
- [Política de tratamiento de datos personales — SIC](https://sedeelectronica.sic.gov.co/politica-de-tratamiento-de-datos-personales), como guía pública sobre derechos, finalidades y canales de atención.
- [Workers Logs — documentación de Cloudflare](https://developers.cloudflare.com/workers/observability/logs/workers-logs/), para validar metadatos, habilitación y retención en la configuración real.
