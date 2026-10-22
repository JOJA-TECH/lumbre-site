// Reescribe enlaces internos .md de los cuerpos Markdown a las URLs públicas de ADR-003.
// Misma convención de resolución que src/features/validation/cli.ts (enlaces dentro de la publicación);
// los enlaces rotos los detecta `pnpm validate` antes del build.
function resolve(href, work) {
  if (!work) return href;
  const clean = href.split('#')[0]?.split('?')[0] ?? '';
  const parts = clean.split('/').filter((p) => p !== '' && p !== '.');
  if (parts.length === 0) return href;
  if (parts[0] === '..') parts.shift();
  const file = parts.pop();
  if (!file || !/\.md$/i.test(file)) return href;
  const slug = file.replace(/\.md$/i, '');
  const targetWork = parts.length > 0 ? parts[parts.length - 1] : work;
  return slug === '_obra' ? `/obras/${targetWork}/` : `/obras/${targetWork}/${slug}/`;
}

export function rehypeMdLinks() {
  return (tree, file) => {
    const work = file.data?.astro?.frontmatter?.work;
    const visit = (node) => {
      if (Array.isArray(node.children)) for (const child of node.children) visit(child);
      if (node.tagName === 'a' && typeof node.properties?.href === 'string' && /\.md([?#]|$)/i.test(node.properties.href)) {
        node.properties.href = resolve(node.properties.href, work);
      }
    };
    visit(tree);
  };
}
