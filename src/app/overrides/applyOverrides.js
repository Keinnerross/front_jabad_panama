/**
 * Helpers PUROS de la capa de overrides (sirven en server o client).
 *
 * Todos reciben el `config` (el objeto de overrides.json) y caen al DEFAULT
 * cuando no hay override para ese id. Nunca lanzan.
 */

/** Texto override por id, o el fallback (default del core). */
export function getText(config, id, fallback) {
  return config?.text?.[id] ?? fallback;
}

/** Link/URL override por id, o el fallback. */
export function getLink(config, id, fallback) {
  return config?.links?.[id] ?? fallback;
}

/** ¿Este id está marcado para ocultarse? (también se aplica vía CSS server-side). */
export function isHidden(config, id) {
  return Array.isArray(config?.hide) && config.hide.includes(id);
}

/** Lista de campos a ocultar de un form (por su formId), o []. */
export function getHiddenFields(config, formId) {
  const fields = config?.hiddenFields?.[formId];
  return Array.isArray(fields) ? fields : [];
}

/**
 * Para listas DATA-DRIVEN (ej. items del nav): remapea `path` por el `id`
 * estable del item. No muta el original. Items sin `id` o sin override pasan
 * intactos.
 */
export function applyLinkOverrides(items, linksMap) {
  if (!Array.isArray(items) || !linksMap) return items;
  return items.map((item) => {
    let next = item;
    // Remapea el link de este item por su `id`.
    if (item?.id && linksMap[item.id]) next = { ...next, path: linksMap[item.id] };
    // Recursa en sub-items (ej. links dentro de un dropdown del nav o secciones
    // del footer). Sin esto, un id anidado como `nav-shabbat-meals` no se aplica.
    if (Array.isArray(item?.subItems)) {
      next = { ...next, subItems: applyLinkOverrides(item.subItems, linksMap) };
    }
    return next;
  });
}
