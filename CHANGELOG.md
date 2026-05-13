# SAMY v1.1.0 — Changelog

## 1. Migración a TypeScript
**~2557 líneas en 21 archivos .ts/.tsx**

| Archivo | Cambio |
|---------|--------|
| `tsconfig.json` | Nuevo: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` |
| `vite-env.d.ts` | Nuevo: tipos globales para Vite, `canvas-confetti`, Speech Recognition API |
| `src/types/index.ts` | Nuevo: 12+ interfaces (`SamyStore`, `RoutineTask`, `GameType`, `Accessory`, `SyllableWord`, etc.) |
| `src/store/useStore.ts` | Convertido de JS con tipado completo de Zustand + persist |
| `src/data/*.ts` (4 archivos) | Tipos estrictos en accesorios, fonemas, juegos, rutinas y sílabas |
| `src/hooks/*.ts` (2 archivos) | `useSounds` y `useSpeech` con tipos en callbacks y refs |
| `src/components/*.tsx` (6 archivos) | Props tipadas, `ReactNode` en renderizado condicional |
| `src/pages/*.tsx` (5 páginas + silabas) | Estados tipados, tipos de unión para secciones |
| `src/App.tsx` + `src/main.tsx` | Entry points con tipos |
| `vite.config.ts` | Convertido de `.js` a `.ts` |
| `index.html` | Referencia actualizada a `src/main.tsx`, lang="es", fuente Nunito |
| `eslint.config.js` | Actualizado para cubrir `.ts/.tsx` |
| `package.json` | name→samy, nuevos scripts: `typecheck`, `build` con pre-check |

## 2. Correcciones de bugs

| # | Bug | Solución |
|---|-----|----------|
| 1 | **Algoritmo Levenshtein roto** en `useSpeech` | Reescribo implementación con 2-filas correcta |
| 2 | **`'sol'` en nivel de 2 sílabas** (es monosílaba) | Movido de nivel 2 al 1; reemplazado por `'sopa'` |
| 3 | **Chrome no reproduce voz** (error `canceled`) | `synth.cancel()` condicional (solo si algo habla), `synth.resume()` inicial |
| 4 | **Race condition en speech** (cancel reintentaba texto viejo) | Eliminado reintento en `onerror('canceled')` |
| 5 | **QuickTimer overflow** en márgenes | Reducción del SVG del timer (200→180px), botones compactos, `flex-wrap`, `overflow-hidden` |
| 6 | **Último botón cortado por NavBar** | `pb-24` en Home + `pb-40` en App + 160px en body |
| 7 | **Entrada de PIN sin validación por teclado** | Envuelto en `<form onSubmit>` |
| 8 | **Instrucción de juego se repetía al cargar voces** | Separado `speak` de `initGame` con `useEffect` independiente |
| 9 | **"Toca los Flores" → "Toca las Flores"** y otras concordancias | Agregado campo `article` a `ClassifyCategory` (los/las/la) |
| 10 | **Speech se saltaba nombres al clasificar** | Eliminada race condition del reintento en `onerror` |
| 11 | **Sílabas se pronunciaban como letras (LU-ENEA)** | Pasadas a minúsculas en `speak()` |
| 12 | **Emoji incorrecto MESA 🪑→🍴** | Corregido |

## 3. Arquitectura y componentes nuevos

| Componente | Descripción |
|-----------|-------------|
| `ErrorBoundary.tsx` | Clase React con fallback amigable (gato + "Recargar") |
| `QuickTimer.tsx` | Extraído de `MiMapa.tsx` como componente independiente |
| `SyllablesGame` (en Habla.tsx) | Juego de composición silábica (nuevo tab "🧩 Sílabas") |
| `src/types/index.ts` | Todas las interfaces centralizadas |
| `src/data/silabas.ts` | 60 palabras para composición silábica |

## 4. Nuevas funcionalidades

### Juego de Sílabas (🧩 Sílabas)
- Tercer tab en "Habla Aventuras"
- Muestra emoji + casillas vacías + sílabas mezcladas
- El niño presiona sílabas en orden para formar la palabra
- Cada sílaba se pronuncia al presionarla
- Al completar correctamente: celebración (confetti + 15 puntos) + se pronuncia la palabra completa
- Si es incorrecta: se reinicia con las mismas sílabas
- **60 palabras** adecuadas para niña de 8 años:
  - Animales: gato, perro, conejo, tortuga, mariposa, caballo, gallina, rana, oso, pato
  - Naturaleza: sol, luna, flor, estrella, nube, arcoíris, mar
  - Fantasía: hada, princesa, sirena, castillo, unicornio
  - Hogar/escuela: casa, mesa, silla, escuela, mamá, papá, amiga
  - Comida: manzana, plátano, chocolate, helado, sopa, pan, fruta
  - Objetos: zapato, pelota, bicicleta, llave, campana, ventana, regalo

### Juego de Clasificar (en Retos)
- Al presionar un elemento correcto, la app dice su nombre ("manzana", "perro", "flor"...)
- Mapa de nombres de emojis centralizado (`emojiNames` en `juegos.ts`)

## 5. Rediseño visual completo (UI moderna)

### Sistema de diseño
- **Fuente**: Nunito (Google Fonts, 400-900), redonda y amigable
- **Paleta**: Violeta/índigo (#7C3AED) + rosa (#EC4899) + cyan (#06B6D4)
- **Fondo**: Blanco violáceo suave con 4 gradientes radiales sutiles
- **Sombras**: Difusas y coloreadas en vez de grises duras
- **Bordes**: Radio 20-28px en todos lados (antes 12-16px)

### Glassmorfismo 2.0
- `backdrop-filter: blur(24px) saturate(180%)`
- `box-shadow` con color primario en vez de negro
- Variantes: `.glass` (hover con elevación), `.glass-elevated` (más sombra)

### Botones
- Gradientes + glow shadow + `active:scale-95` + `transition-all`
- Clases utilitarias: `.btn-primary`, `.btn-ghost`
- Timer: gradiente SVG con `drop-shadow` animado

### NavBar
- Pastilla flotante con `rounded-[28px]` + blur fuerte
- `layoutId="nav-pill"` animado con gradiente violeta
- Iconos `strokeWidth={1.8}` fino, `2.5` en activo

### Animaciones
- Curva de easing `[0.22, 1, 0.36, 1]` (orgánica)
- Transiciones con `filter: blur(4px)` en cambios de ruta
- `float-anim` CSS para la mascota
- `pulse-ring` para botón de grabación de micrófono

## 5. Archivos eliminados
- `src/App.css` (184 líneas sin usar — residuo template Vite)
- 17 archivos `.js` / `.jsx` originales
- `vite.config.js`

## 6. Build
```
✓ TypeScript check: 0 errores
✓ Vite build: ~685ms
  dist/index.html              0.45 kB
  dist/assets/index.css         31 kB (gzip 5.9 kB)
  dist/assets/index.js         421 kB (gzip 134 kB)
```
