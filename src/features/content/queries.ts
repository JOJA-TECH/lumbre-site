// Consultas compartidas sobre Content Collections (SPEC-005/SPEC-008).
// Única vía de acceso a colecciones para páginas y features (ARQ-2).
import { getCollection, type CollectionEntry } from 'astro:content';

export type WorkEntry = CollectionEntry<'works'>;
export type ChapterEntry = CollectionEntry<'chapters'>;

export type CatalogEntry = { work: WorkEntry; chapters: ChapterEntry[] };

export function workUrl(work: string): string {
  return `/obras/${work}/`;
}

export function chapterUrl(work: string, slug: string): string {
  return `/obras/${work}/${slug}/`;
}

export async function getCatalog(): Promise<CatalogEntry[]> {
  const [works, chapters] = await Promise.all([getCollection('works'), getCollection('chapters')]);
  return works
    .map((work) => ({
      work,
      chapters: chapters
        .filter((c) => c.data.work === work.data.work)
        .sort(
          (a, b) =>
            (a.data.order ?? 1) - (b.data.order ?? 1) ||
            a.data.date_published.localeCompare(b.data.date_published),
        ),
    }))
    .sort((a, b) => a.work.data.title.localeCompare(b.work.data.title));
}

export function neighbors(chapters: ChapterEntry[], slug: string): { prev: ChapterEntry | null; next: ChapterEntry | null } {
  const idx = chapters.findIndex((c) => c.data.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? chapters[idx - 1] ?? null : null,
    next: idx < chapters.length - 1 ? chapters[idx + 1] ?? null : null,
  };
}
