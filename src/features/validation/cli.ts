// Validador de contenido Lumbre (SPEC-006, ciclo C1 / F1): reglas PUB-3 + contrato v1.
// Modos: `validate [rutas...]` (publicaciones Markdown) y `--fixtures [dir]` (matriz de fixtures).
import { readdir, readFile } from 'node:fs/promises';
import { basename, join, relative, resolve } from 'node:path';
import { z } from 'astro/zod';
import { chapterSchema, workSchema } from '../content/schemas';

type Issue = { rule: string; label: string; detail: string };
type ZIssue = z.ZodError['issues'][number];
type ChapterOut = z.output<typeof chapterSchema>;
type Publication = { obra: unknown; capitulos: unknown[]; bodies: Map<number, string> };
type PubRef = { work: string; slugs: Set<string> };

const FORBIDDEN: Array<{ rule: string; label: string; re: RegExp }> = [
  { rule: 'prompt', label: 'PUB-3: prompt interno en el cuerpo', re: /\bprompts?\b/i },
  { rule: 'id-interno', label: 'PUB-3: identificador interno de Atelier/Codex en el cuerpo', re: /(?:atelier|codex)[\w-]*id\s*[=:]/i },
  { rule: 'ruta-local', label: 'PUB-3: ruta local de máquina en el cuerpo', re: /[A-Za-z]:[\\/]|(?:^|[\s(])\/(?:Users|home|var|tmp)\// },
  { rule: 'clave', label: 'PUB-3: valor con apariencia de clave', re: /\b[A-Z][A-Z0-9_]{15,}\b/ },
];

function issueFromZod(what: string, issue: ZIssue): Issue {
  if (issue.code === 'unrecognized_keys') {
    return { rule: 'campo-desconocido', label: 'PUB-3: campo desconocido (CON-3)', detail: `${what}: ${issue.message}` };
  }
  if (issue.path.includes('status')) {
    return { rule: 'estado', label: 'PUB-3: estado no publicable (CON-2)', detail: `${what}: status debe ser «publicado»` };
  }
  return { rule: 'schema', label: 'PUB-3: frontmatter fuera del contrato v1', detail: `${what}: ${issue.path.join('.') || 'raíz'}: ${issue.message}` };
}

function checkDate(value: string, what: string, issues: Issue[]): void {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (m === null) return; // el schema ya rechaza el formato
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const utc = new Date(Date.UTC(y, mo - 1, d));
  if (utc.getUTCFullYear() !== y || utc.getUTCMonth() !== mo - 1 || utc.getUTCDate() !== d) {
    issues.push({ rule: 'fecha-invalida', label: 'PUB-3: fecha inválida', detail: `${what}: ${value} no es una fecha real` });
    return;
  }
  const now = new Date();
  const future = y > now.getFullYear() || (y === now.getFullYear() && (mo > now.getMonth() + 1 || (mo === now.getMonth() + 1 && d > now.getDate())));
  if (future) issues.push({ rule: 'fecha-futura', label: 'PUB-3: fecha futura', detail: `${what}: ${value} es posterior a hoy` });
}

function resolvesLink(href: string, selfWork: string, selfSlugs: Set<string>, refs: PubRef[]): boolean {
  const clean = href.split('#')[0]?.split('?')[0] ?? '';
  const parts = clean.split('/').filter((p) => p !== '' && p !== '.');
  if (parts.length === 0) return false;
  if (parts[0] === '..') parts.shift();
  const file = parts.pop() ?? '';
  if (!/\.md$/i.test(file)) return true; // fuera de alcance: imágenes u otros recursos
  const slug = file.replace(/\.md$/i, '');
  const targetWork = parts.length > 0 ? parts[parts.length - 1] : selfWork;
  const ref = targetWork === selfWork ? { slugs: selfSlugs } : refs.find((r) => r.work === targetWork);
  if (ref === undefined) return false;
  return slug === '_obra' || ref.slugs.has(slug);
}

function bodyIssues(what: string, body: string, selfWork: string, selfSlugs: Set<string>, refs: PubRef[]): Issue[] {
  const issues: Issue[] = [];
  if (body.trim() === '') {
    issues.push({ rule: 'cuerpo-vacio', label: 'PUB-3: cuerpo Markdown no vacío', detail: `${what}: cuerpo vacío` });
    return issues;
  }
  for (const f of FORBIDDEN) {
    // no se imprime el fragmento detectado: podría contener material privado
    if (f.re.test(body)) issues.push({ rule: f.rule, label: f.label, detail: `${what}: patrón prohibido en el cuerpo` });
  }
  for (const m of body.matchAll(/\[[^\]]*\]\(([^)\s]+)/g)) {
    const href = m[1] ?? '';
    if (/^(https?:)?\/\//i.test(href) || /^(mailto|tel):/i.test(href) || href.startsWith('#')) continue;
    if (!resolvesLink(href, selfWork, selfSlugs, refs)) {
      issues.push({ rule: 'enlace-interno', label: 'PUB-3: enlace interno no resuelve', detail: `${what}: enlace «${href}» no apunta a un capítulo u obra publicados` });
    }
  }
  return issues;
}

export function validatePublication(pub: Publication, refs: PubRef[]): Issue[] {
  const issues: Issue[] = [];
  const obraRes = workSchema.safeParse(pub.obra);
  if (!obraRes.success) for (const i of obraRes.error.issues) issues.push(issueFromZod('obra', i));
  const parsed = pub.capitulos.map((c, idx) => ({ idx, res: chapterSchema.safeParse(c) }));
  for (const p of parsed) {
    if (!p.res.success) for (const i of p.res.error.issues) issues.push(issueFromZod(`capítulo ${p.idx + 1}`, i));
  }
  const chapters = parsed.flatMap((p) => (p.res.success ? [{ idx: p.idx, ch: p.res.data as ChapterOut }] : []));
  for (const { idx, ch } of chapters) {
    const what = `capítulo ${idx + 1} (${ch.slug})`;
    checkDate(ch.date_published, `${what}: date_published`, issues);
    if (ch.updated !== undefined) checkDate(ch.updated, `${what}: updated`, issues);
  }
  if (obraRes.success && obraRes.data.type === 'serial') {
    for (const c of chapters) {
      if (c.ch.order === undefined) {
        issues.push({ rule: 'order', label: 'PUB-3: serial exige order en todos los capítulos', detail: `capítulo ${c.idx + 1} (${c.ch.slug}): serial sin order` });
      }
    }
    const seen = new Map<number, string>();
    for (const c of chapters) {
      if (c.ch.order === undefined) continue;
      const prev = seen.get(c.ch.order);
      if (prev !== undefined) {
        issues.push({ rule: 'order', label: 'PUB-3: order único dentro del serial', detail: `capítulo ${c.idx + 1} (${c.ch.slug}): order ${c.ch.order} repetido (ya usado por ${prev})` });
      } else {
        seen.set(c.ch.order, c.ch.slug);
      }
    }
  }
  const bySlug = new Map<string, number>();
  for (const c of chapters) {
    const prev = bySlug.get(c.ch.slug);
    if (prev === undefined) bySlug.set(c.ch.slug, c.idx);
    else issues.push({ rule: 'slug', label: 'PUB-3: slug único por obra (CON-5)', detail: `capítulo ${c.idx + 1} (${c.ch.slug}): slug duplicado (también en capítulo ${prev + 1})` });
  }
  const selfWork = obraRes.success ? obraRes.data.work : '';
  const selfSlugs = new Set(bySlug.keys());
  for (const { idx, ch } of chapters) {
    const body = pub.bodies.get(idx);
    if (body === undefined) continue;
    issues.push(...bodyIssues(`capítulo ${idx + 1} (${ch.slug})`, body, selfWork, selfSlugs, refs));
  }
  return issues;
}

// shortcut: parser YAML mínimo (solo campos planos, listas «-» y arrays en línea del contrato v1); YAML anidado se rechaza — ampliar si un export real lo trae.
const NUMERIC_KEYS = new Set(['contract_version', 'order']); // únicos campos numéricos del contrato v1

function parseFrontmatter(text: string): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    if (line.trim() === '') continue;
    const kv = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (kv === null) throw new Error(`frontmatter no soportado: «${line.trim()}»`);
    const value = kv[2] ?? '';
    if (value !== '') {
      data[kv[1]] = parseScalar(value, NUMERIC_KEYS.has(kv[1]));
      continue;
    }
    const items: unknown[] = [];
    let j = i + 1;
    while (j < lines.length) {
      const item = /^\s*-\s+(.*)$/.exec(lines[j] ?? '');
      if (item === null) break;
      items.push(parseScalar(item[1] ?? ''));
      j++;
    }
    data[kv[1]] = items.length > 0 ? items : '';
    i = j - 1;
  }
  return data;
}

function parseScalar(raw: string, numeric = false): unknown {
  const v = raw.trim();
  const quoted = /^(["'])([\s\S]*)\1$/.exec(v);
  if (quoted !== null) return quoted[2] ?? '';
  const comment = v.indexOf(' #');
  const clean = comment >= 0 ? v.slice(0, comment).trim() : v;
  if (numeric && /^\d+$/.test(clean)) return Number(clean);
  if (clean.startsWith('[') && clean.endsWith(']')) {
    const inner = clean.slice(1, -1).trim();
    return inner === '' ? [] : inner.split(',').map((s) => parseScalar(s));
  }
  return clean;
}

function splitFrontmatter(src: string): { data: Record<string, unknown>; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(src.replace(/^\uFEFF/, ''));
  if (m === null) throw new Error('sin bloque de frontmatter YAML (--- … ---)');
  return { data: parseFrontmatter(m[1] ?? ''), body: src.slice(m[0].length) };
}

async function listFiles(dir: string, ext: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true, recursive: true });
    return entries.filter((e) => e.isFile() && e.name.endsWith(ext)).map((e) => join(e.parentPath, e.name));
  } catch {
    return [];
  }
}

function ruleIdFromFixture(rule: string): string | undefined {
  const map: Array<[RegExp, string]> = [
    [/slug/i, 'slug'],
    [/order/i, 'order'],
    [/prompt/i, 'prompt'],
    [/identificador/i, 'id-interno'],
    [/ruta/i, 'ruta-local'],
    [/clave/i, 'clave'],
    [/enlace/i, 'enlace-interno'],
    [/cuerpo/i, 'cuerpo-vacio'],
  ];
  return map.find(([re]) => re.test(rule))?.[1];
}

async function runFixtures(dir: string): Promise<number> {
  const files = (await listFiles(dir, '.json')).sort();
  let ok = 0;
  let fails = 0;
  for (const file of files) {
    const id = relative(dir, file).replaceAll('\\', '/').replace(/\.json$/, '');
    try {
      const json = JSON.parse((await readFile(file, 'utf8')).replace(/^\uFEFF/, '')) as Record<string, unknown>;
      const lumbre = json.expected === 'accept' || json.expected === 'reject';
      const expect: 'accept' | 'reject' = lumbre ? (json.expected as 'accept' | 'reject') : relIncludesInvalid(file, dir) ? 'reject' : 'accept';
      const source = lumbre ? ((json.publication ?? {}) as Record<string, unknown>) : json;
      const bodies = new Map<number, string>();
      if (Array.isArray(json.bodies)) {
        for (const b of json.bodies as Array<{ chapter_index?: unknown; markdown?: unknown }>) {
          if (typeof b.chapter_index === 'number' && typeof b.markdown === 'string') bodies.set(b.chapter_index, b.markdown);
        }
      }
      const issues = validatePublication({ obra: source.obra, capitulos: Array.isArray(source.capitulos) ? source.capitulos : [], bodies }, []);
      const labels = issues.map((i) => i.label).join('; ');
      const declaredRule = lumbre && typeof json.rule === 'string' ? json.rule : undefined;
      let pass: boolean;
      let note: string;
      if (expect === 'accept') {
        pass = issues.length === 0;
        note = pass ? 'aceptada' : `esperaba aceptar, falló: ${labels}`;
      } else if (issues.length === 0) {
        pass = false;
        note = `esperaba rechazo (${declaredRule ?? 'fixture inválida'}) pero la publicación pasó la validación`;
      } else if (declaredRule !== undefined && !issues.some((i) => i.rule === ruleIdFromFixture(declaredRule))) {
        pass = false;
        note = `rechazada por otra regla: ${labels} (esperaba: ${declaredRule})`;
      } else {
        pass = true;
        note = `rechazada: ${labels}`;
      }
      if (pass) {
        ok++;
        console.log(`  OK   ${id} — ${note}`);
      } else {
        fails++;
        console.log(`  FAIL ${id} — ${note}`);
      }
    } catch (err) {
      fails++;
      console.log(`  FAIL ${id} — caso no procesable: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  console.log(`Resumen fixtures: ${ok}/${files.length} casos correctos`);
  return fails === 0 ? 0 : 1;
}

function relIncludesInvalid(file: string, dir: string): boolean {
  return /(^|\/)invalid\//.test(relative(dir, file).replaceAll('\\', '/'));
}

async function runValidate(roots: string[]): Promise<number> {
  const files = (await Promise.all(roots.map((r) => listFiles(resolve(r), '.md')))).flat().sort();
  if (files.length === 0) {
    console.log('0 publications');
    return 0;
  }
  const obras = new Map<string, { obra: unknown; obraPath: string; chapters: Array<{ data: Record<string, unknown>; body: string; path: string }> }>();
  const orphans: Array<{ data: Record<string, unknown>; body: string; path: string }> = [];
  const problems: string[] = [];
  for (const file of files) {
    let fm: { data: Record<string, unknown>; body: string };
    try {
      fm = splitFrontmatter(await readFile(file, 'utf8'));
    } catch (err) {
      problems.push(`${file}: ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }
    if (basename(file) === '_obra.md') {
      const work = typeof fm.data.work === 'string' ? fm.data.work : '';
      if (work === '') problems.push(`${file}: obra sin campo «work» utilizable`);
      else if (obras.has(work)) problems.push(`${file}: obra duplicada «${work}» (ya definida en ${obras.get(work)?.obraPath})`);
      else obras.set(work, { obra: fm.data, obraPath: file, chapters: [] });
    } else {
      orphans.push({ data: fm.data, body: fm.body, path: file });
    }
  }
  for (const ch of orphans) {
    const work = typeof ch.data.work === 'string' ? ch.data.work : '';
    const pub = obras.get(work);
    if (pub !== undefined) pub.chapters.push({ data: ch.data, body: ch.body, path: ch.path });
    else problems.push(`${ch.path}: capítulo sin obra (frontmatter «work»${work === '' ? ' ausente' : ` «${work}»`} sin _obra.md correspondiente)`);
  }
  const refsByWork = new Map<string, Set<string>>();
  for (const [work, pub] of obras) {
    const slugs = new Set<string>();
    for (const c of pub.chapters) {
      const r = chapterSchema.safeParse(c.data);
      if (r.success) slugs.add(r.data.slug);
    }
    refsByWork.set(work, slugs);
  }
  let errorCount = problems.length;
  for (const [work, pub] of obras) {
    const bodies = new Map<number, string>();
    pub.chapters.forEach((c, i) => bodies.set(i, c.body));
    const refs: PubRef[] = [...refsByWork].filter(([w]) => w !== work).map(([w, slugs]) => ({ work: w, slugs }));
    const issues = validatePublication({ obra: pub.obra, capitulos: pub.chapters.map((c) => c.data), bodies }, refs);
    if (issues.length === 0) console.log(`  OK   ${work} (${pub.chapters.length} capítulo${pub.chapters.length === 1 ? '' : 's'})`);
    else for (const i of issues) {
      errorCount++;
      console.log(`  FAIL ${work} — ${i.label}: ${i.detail}`);
    }
  }
  for (const p of problems) console.log(`  FAIL contenido — ${p}`);
  console.log(`Resumen: ${obras.size} publicación(es), ${errorCount} error(es)`);
  return errorCount === 0 ? 0 : 1;
}

const args = process.argv.slice(2);
const fixturesIdx = args.indexOf('--fixtures');
if (fixturesIdx >= 0) {
  const dirArg = args[fixturesIdx + 1];
  process.exitCode = await runFixtures(resolve(dirArg !== undefined && !dirArg.startsWith('-') ? dirArg : 'contract/v1/fixtures'));
} else {
  const paths = args.filter((a) => !a.startsWith('-'));
  process.exitCode = await runValidate(paths.length > 0 ? paths : ['content']);
}
