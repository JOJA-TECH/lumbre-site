import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { chapterSchema, workSchema } from './schemas';

const works = defineCollection({
  loader: glob({ pattern: '**/_obra.md', base: './content' }),
  schema: workSchema,
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './content' }),
  schema: chapterSchema,
});

export const collections = { works, chapters };
