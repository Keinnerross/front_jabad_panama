import { promises as fs } from 'fs';
import path from 'path';

/**
 * Capa de overrides por instancia (server-only).
 *
 * Lee una carpeta con dos archivos opcionales:
 *   - overrides.json  → texto, links, campos ocultos, y ids a ocultar (`hide`).
 *   - overrides.css   → ajustes visuales finos (libre).
 *
 * Por defecto la carpeta es `<repo>/instance-overrides/` (gitignoreada: sobrevive
 * a `git pull`). Se puede apuntar a otra ruta con la env `OVERRIDES_PATH`.
 *
 * Filosofía: el core trae los DEFAULTS; el override solo TAPA lo que esa
 * instancia necesita. Si la carpeta o los archivos no existen, o el JSON está
 * roto, se degrada limpio a `{ config: {}, css: '' }` y la web usa sus defaults.
 *
 * Ver `README.md` en esta carpeta para el contrato de ids/anclajes.
 */

// Memoizado por proceso: la config es estática por instancia. Un cambio en los
// archivos requiere reiniciar el server (acordado).
let cached = null;

// Solo se permiten ids "seguros" como selectores CSS (evita inyección desde el
// archivo y selectores rotos). Letras, números, guion, guion bajo y dos puntos.
const SAFE_ID = /^[\w:-]+$/;

export async function loadOverrides() {
  if (cached) return cached;

  const dir = process.env.OVERRIDES_PATH
    ? path.resolve(process.env.OVERRIDES_PATH)
    : path.join(process.cwd(), 'instance-overrides');

  let config = {};
  try {
    const raw = await fs.readFile(path.join(dir, 'overrides.json'), 'utf8');
    config = JSON.parse(raw) || {};
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('⚠️ overrides.json no se pudo leer/parsear, se ignora:', error.message);
    }
    config = {};
  }

  let userCss = '';
  try {
    userCss = await fs.readFile(path.join(dir, 'overrides.css'), 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('⚠️ overrides.css no se pudo leer, se ignora:', error.message);
    }
    userCss = '';
  }

  // `hide: ["id", ...]` → reglas display:none por ancla `data-cust`.
  // Se aplica server-side junto al CSS → oculta antes de pintar (sin flicker).
  const hideCss = Array.isArray(config.hide)
    ? config.hide
        .filter((id) => typeof id === 'string' && SAFE_ID.test(id))
        .map((id) => `[data-cust="${id}"]{display:none !important;}`)
        .join('\n')
    : '';

  cached = { config, css: [hideCss, userCss].filter(Boolean).join('\n') };
  return cached;
}
