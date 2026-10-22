import { z } from 'astro/zod';

const workSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

// El contrato v1 define la fecha como ISO 8601 «YYYY-MM-DD»; los parsers YAML conformes
// la entregan como Date (UTC). Se acepta y normaliza sin cambiar la semántica del contrato.
const isoDate = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
);

export const workSchema = z
  .object({
    contract_version: z.literal(1),
    work: workSlug,
    title: z.string().min(1),
    author: z.string().min(1),
    lang: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
    type: z.enum(['relato', 'serial']),
    synopsis: z.string().min(1),
    tags: z.array(z.string().min(1)).optional(),
  })
  .strict()
  .refine((work) => !work.tags || new Set(work.tags).size === work.tags.length, {
    message: 'tags debe contener valores únicos',
    path: ['tags'],
  });

export const chapterSchema = z
  .object({
    contract_version: z.literal(1),
    work: workSlug,
    slug: workSlug,
    title: z.string().min(1),
    uid: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/),
    status: z.literal('publicado'),
    date_published: isoDate,
    order: z.number().int().min(1).optional(),
    synopsis: z.string().min(1).optional(),
    updated: isoDate.optional(),
    source_revision: z.string().regex(/^[a-f0-9]{7,64}$/),
  })
  .strict();
