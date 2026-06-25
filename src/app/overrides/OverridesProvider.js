'use client';

import { createContext, useContext, useMemo } from 'react';
import { getText, getLink, isHidden, getHiddenFields } from './applyOverrides';

/**
 * Provider de la capa de overrides. El `config` (overrides.json) se lee en el
 * server (root layout) y se pasa aquí, así que los componentes cliente lo leen
 * sin volver a tocar disco.
 *
 * Uso en un componente cliente:
 *   const { getText, getLink, isHidden, getHiddenFields } = useOverrides();
 *   <a href={getLink('footer-kwb', 'https://kosherwithoutborders.com')}>...</a>
 */
const OverridesContext = createContext({
  config: {},
  getText: (_id, fallback) => fallback,
  getLink: (_id, fallback) => fallback,
  isHidden: () => false,
  getHiddenFields: () => [],
});

export function OverridesProvider({ config = {}, children }) {
  const value = useMemo(
    () => ({
      config,
      getText: (id, fallback) => getText(config, id, fallback),
      getLink: (id, fallback) => getLink(config, id, fallback),
      isHidden: (id) => isHidden(config, id),
      getHiddenFields: (formId) => getHiddenFields(config, formId),
    }),
    [config]
  );

  return <OverridesContext.Provider value={value}>{children}</OverridesContext.Provider>;
}

export function useOverrides() {
  return useContext(OverridesContext);
}
