import { defineConfig } from 'astro/config';
import { rehypeMdLinks } from './src/features/content/md-links.mjs';

export default defineConfig({
  output: 'static',
  // shortcut: markdown.rehypePlugins está deprecado en Astro 7; migrar a unified() de @astrojs/markdown-remark al actualizar a Astro 8.
  markdown: { rehypePlugins: [rehypeMdLinks] },
});
