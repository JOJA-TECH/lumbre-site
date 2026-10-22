// shortcut: tipos mínimos de Node para el CLI; sustituir por @types/node cuando se permita añadir la dependencia.
declare module 'node:fs/promises' {
  export interface Dirent {
    isFile(): boolean;
    name: string;
    parentPath: string;
  }
  export function readdir(path: string, options: { withFileTypes: true; recursive?: boolean }): Promise<Dirent[]>;
  export function readFile(path: string, encoding: 'utf8'): Promise<string>;
}

declare module 'node:path' {
  export function basename(path: string): string;
  export function join(...segments: string[]): string;
  export function relative(from: string, to: string): string;
  export function resolve(...segments: string[]): string;
}

declare var process: {
  argv: string[];
  cwd(): string;
  exitCode: number | string | undefined;
};
