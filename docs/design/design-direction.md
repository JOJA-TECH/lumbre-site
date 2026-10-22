# Dirección de diseño — «Papel frío, tinta y brasa»

- **Estado:** Propuesta (C2a, SPEC-007 · `LU-F2-S2`, `LU-F2-S4`, `A11Y-1`)
- **Fecha:** 2026-10-22 · agente, bajo instrucción del propietario
- **Tokens:** `src/styles/tokens.css` · verificación: `pnpm test:a11y`
- **Nota metodológica:** la persona y el journey son un **arquetipo editorial declarado como hipótesis de trabajo**, no resultados de investigación con usuarios. Se validará con lectores reales cuando existan (F4 pide evidencia antes de preferencias de lectura).

## Persona (hipótesis)

**L., lectora de sesión larga** — lectora de ficción en español, 30–90 minutos por sesión, alterna móvil (trayectos, noche) y escritorio.

- **Objetivo:** entrar, elegir una obra y leer capítulos encadenados sin fricción ni fatiga.
- **Frustraciones típicas de lectura web (hipótesis):** fondo brillante que cansa a los pocos minutos; columnas demasiado anchas que obligan a rastrear el renglón; perder el lugar al volver de una interrupción; metadatos y decoración que compiten con el párrafo; páginas que no funcionan sin JavaScript.
- **Implicaciones de diseño:** una sola columna a `--measure`; serif de lectura real (Literata fue diseñada para libros electrónicos); jerarquía silenciosa; el cromo siempre menor que el texto en tamaño y peso; cero JS de cliente; foco visible para navegación por teclado.

## Journey (hipótesis)

| Etapa | Qué hace | Dolor típico | Respuesta del shell |
|---|---|---|---|
| 1. Llega al inicio | Evalúa el sitio en segundos | «¿Catálogo o panel de control?» | El texto manda: portada tipográfica, sin tarjetas ni sombras |
| 2. Elige una obra | Lee la sinopsis, decide | Jerarquía confusa | Tinta/ceniza, títulos en Literata, sin etiquetas decorativas |
| 3. Lee el capítulo | Sesión larga, quizá de noche | Fatiga visual, pérdida de lugar | 65ch, interlineado holgado, ritmo vertical estable, papel frío |
| 4. Pasa al siguiente | Encadena capítulos | ¿Dónde sigo? | Navegación prev/siguiente predecible en el flujo (C2b), enlace en brasa visible |

## Concepto

**Lumbre** es la luz del hogar: leer junto al fuego, de noche y por tiempo largo. La paleta juega con dos temperaturas con significado: el papel y la tinta son **fríos** (calma de tinta electrónica para sesiones largas) y lo **cálido** —la brasa de óxido— se reserva para lo vivo: enlaces, marca, lo que arde. El único azul profundo y frío (`noche`) queda apartado para el anillo de foco: lo que responde al teclado.

## Paleta

| Nombre | Token | Hex | Rol |
|---|---|---|---|
| Papel | `--color-bg` | `#EDEFE9` | Fondo general; gris reciclado frío, nunca crema cálido ni blanco puro |
| Pliego | `--color-surface` | `#F8FAF5` | Superficies y paneles que se apoyan sobre el papel |
| Línea | `--color-border` | `#79828C` | Filetes; visible (≥3:1) sin ser pesado |
| Tinta | `--color-text` | `#1E2430` | Texto; azul-negro de escritura, no negro teñido de cromo |
| Ceniza | `--color-text-muted` | `#55606B` | Metadatos, fechas, texto secundario |
| Brasa | `--color-accent` | `#9C3B22` | Enlaces y marca; óxido profundo de tela de encuadernación |
| Lumbre clara | `--color-accent-contrast` | `#FBF6EE` | Texto sobre brasa |
| Noche | `--color-focus` | `#1F4E5F` | Anillo de foco; único azul frío, reservado al teclado |

## Tipografía

Familia única: **Literata Variable** (`--font-body`, autoalojada vía `@fontsource-variable/literata`, `PRI-2`: sin peticiones externas). Elegida por ser una serif proyectada específicamente para lectura prolongada en pantalla (Google Play Books), con eje óptico y pesos amplios.

| Rol | Peso | Token de tamaño |
|---|---|---|
| Cuerpo de lectura | 400 | `--text-base` (17→19px fluido) |
| Metadatos, pie, nav | 400–500 | `--text-sm` |
| Subtítulos, entradilla | 500 | `--text-lg` |
| Título de obra / capítulo | 600 | `--text-xl` |
| Display de portada | 650 | `--text-2xl` |

Escala fluida con `clamp()` (320px → 1200px), medida de línea `--measure: 65ch`, ritmo vertical en la escala `--space-1…8` (lineal, base 0.5rem).

## Layout

Una sola columna de prosa centrada a `--measure`, con ritmo vertical generoso y jerarquía estrictamente tipográfica: nada compite con el párrafo. El cromo (nav, pie, metadatos) es menor en cuerpo y peso que el texto; la alineación es a la izquierda con renglón desigual, y solo la marca/portada puede centrarse. Sin tarjetas, sombras ni rejillas de módulos: la estructura la dan el tamaño, el peso y el blanco.

## Principios

1. **El texto es la interfaz.** Todo lo que no sea el relato es secundario en tamaño, peso y color.
2. **Dos temperaturas con significado.** Frío (papel, tinta, ceniza) para leer; cálido (brasa) solo para lo vivo; azul noche solo para el foco de teclado.
3. **Sin decorado.** Cero tarjetas, sombras, eyebrows en mayúsculas o puntos medios; si un elemento no aporta información de estructura, no existe.
4. **Legible primero.** 65ch, serif de lectura, contraste AA verificado por script, foco visible, 0 JS de cliente.

## Por qué no es la opción por defecto

El default para «sitio literario» sería crema cálido `#F4F1EA` + terracota `#D97757` + filetes de periódico. Aquí el papel es **frío y gris-verdoso** (reciclado, tinta electrónica), la tinta tiene matiz azul como la tinta real de escritura, el acento es un **óxido oscuro de encuadernación** (L*≈30 frente al L*≈62 de la terracota) y existe una **segunda temperatura** (noche petróleo) con un solo trabajo: el foco. Nada de eyebrows, tarjetas SaaS ni markers numerados.

## Verificación de contraste (WCAG 2.2 AA)

Salida de `pnpm test:a11y` (2026-10-22):

| Par | Valores | Ratio | Mínimo | Resultado |
|---|---|---|---|---|
| `text/bg` | `#1E2430` / `#EDEFE9` | 13.42:1 | 4.5 | OK |
| `text/surface` | `#1E2430` / `#F8FAF5` | 14.80:1 | 4.5 | OK |
| `text-muted/bg` | `#55606B` / `#EDEFE9` | 5.54:1 | 4.5 | OK |
| `text-muted/surface` | `#55606B` / `#F8FAF5` | 6.11:1 | 4.5 | OK |
| `accent/bg` | `#9C3B22` / `#EDEFE9` | 5.92:1 | 4.5 | OK |
| `accent-contrast/accent` | `#FBF6EE` / `#9C3B22` | 6.37:1 | 4.5 | OK |
| `focus/bg` | `#1F4E5F` / `#EDEFE9` | 7.83:1 | 3 | OK |
| `focus/surface` | `#1F4E5F` / `#F8FAF5` | 8.64:1 | 3 | OK |
| `border/bg` | `#79828C` / `#EDEFE9` | 3.37:1 | 3 | OK |

El script falla con exit ≠ 0 nombrando par, valor medido y mínimo si algún token deja de cumplir.
