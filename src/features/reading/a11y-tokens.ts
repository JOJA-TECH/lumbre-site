// Verificación de contraste WCAG 2.2 AA de los tokens de color (SPEC-007, CA-2).
// Lee src/styles/tokens.css, comprueba los pares de uso y sale con exitCode ≠ 0
// nombrando par, valor medido y mínimo cuando alguno incumple.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type RGB = readonly [number, number, number];

async function main(): Promise<number> {
  const cssPath = resolve(process.cwd(), 'src', 'styles', 'tokens.css');
  let css: string;
  try {
    css = await readFile(cssPath, 'utf8');
  } catch {
    console.error(`No se pudo leer ${cssPath} (ejecutar desde la raíz del repo).`);
    return 1;
  }
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');

  const tokens = new Map<string, string>();
  for (const m of css.matchAll(/--color-([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    tokens.set(m[1], m[2]);
  }

  function value(name: string): string | undefined {
    return tokens.get(name);
  }

  function hexToRgb(hex: string): RGB {
    const full = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
    const n = Number.parseInt(full.slice(1), 16);
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
  }

  function luminance([r, g, b]: RGB): number {
    const lin = (c: number): number => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  }

  function contrast(fg: string, bg: string): number {
    const lf = luminance(hexToRgb(fg));
    const lb = luminance(hexToRgb(bg));
    const [hi, lo] = lf >= lb ? [lf, lb] : [lb, lf];
    return (hi + 0.05) / (lo + 0.05);
  }

  const pairs: Array<{ par: string; fg: string; bg: string; min: number }> = [
    { par: 'text/bg', fg: 'text', bg: 'bg', min: 4.5 },
    { par: 'text/surface', fg: 'text', bg: 'surface', min: 4.5 },
    { par: 'text-muted/bg', fg: 'text-muted', bg: 'bg', min: 4.5 },
    { par: 'text-muted/surface', fg: 'text-muted', bg: 'surface', min: 4.5 },
    { par: 'accent/bg', fg: 'accent', bg: 'bg', min: 4.5 },
    { par: 'accent-contrast/accent', fg: 'accent-contrast', bg: 'accent', min: 4.5 },
    { par: 'focus/bg', fg: 'focus', bg: 'bg', min: 3 },
    { par: 'focus/surface', fg: 'focus', bg: 'surface', min: 3 },
    { par: 'border/bg', fg: 'border', bg: 'bg', min: 3 },
  ];

  const missing = [...new Set(pairs.flatMap((p) => [p.fg, p.bg]))].filter((k) => value(k) === undefined);
  if (missing.length > 0) {
    console.error(`Tokens de color ausentes en ${cssPath}: ${missing.map((k) => `--color-${k}`).join(', ')}`);
    return 1;
  }

  const failures: string[] = [];
  for (const { par, fg, bg, min } of pairs) {
    const f = value(fg) as string;
    const b = value(bg) as string;
    const ratio = contrast(f, b);
    const ok = ratio >= min;
    if (!ok) failures.push(`${par}: ${ratio.toFixed(2)}:1 < mínimo ${min}:1 (${f}/${b})`);
    console.log(`${par}=${f}/${b}:${ratio.toFixed(2)}:${ok ? 'OK' : 'FAIL'}`);
  }

  if (failures.length > 0) {
    console.error(`\nContraste WCAG 2.2 AA insuficiente (${failures.length} par/es):`);
    for (const f of failures) console.error(`  FAIL ${f}`);
    return 1;
  }
  console.log('\nTodos los pares cumplen WCAG 2.2 AA.');
  return 0;
}

process.exitCode = await main();
