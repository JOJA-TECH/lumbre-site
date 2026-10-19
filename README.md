# Lumbre

Sitio editorial estático para relatos y novelas serializadas exportados desde DeepWrite Atelier.

## Estado

La base Astro se está inicializando por fases conforme a [`ROADMAP.md`](ROADMAP.md). Las decisiones de framework, hosting inicial y URLs están en `docs/decisions/`. Las ramas de trabajo y sus PR/previews son staging; `main` es producción y solo recibe cambios tras revisión humana. No se publican historias ni se despliega producción desde esta etapa.

## Contenido

Las historias aprobadas para publicación vivirán en `content/<work>/` como Markdown con frontmatter validado por el contrato versionado en [`contract/`](contract/README.md). No copiar manuscritos privados, prompts, claves ni datos internos de Atelier a este repositorio.

## Comandos

Requiere Node.js 22.12 o posterior y pnpm 12.11.2 (fijado en `package.json`). TypeScript se mantiene en 6.0.3 porque Astro Check aún no admite la versión 7.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm preview
```

`pnpm preview` sirve localmente el artefacto `dist/` mediante Wrangler. No despliega el sitio.
