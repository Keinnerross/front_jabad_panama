# Capa de overrides por instancia

Permite personalizar elementos **a nivel visual/contenido por instancia** (ocultar, cambiar
texto, cambiar links, quitar campos de form) **sin tocar el backend** y **sin que las
actualizaciones del core pisen el cambio**.

## Cómo funciona

1. Cada instancia tiene una carpeta **dentro del repo pero gitignoreada**:
   `front_chabad/instance-overrides/` (sobrevive a `git pull` porque git no la rastrea).
   Se puede apuntar a otra ruta con la env `OVERRIDES_PATH` si hiciera falta.
2. Esa carpeta tiene 2 archivos opcionales (hay una plantilla `overrides.example.json` versionada):
   - `overrides.json` → reglas declarativas (texto, links, hide, campos de form).
   - `overrides.css` → CSS libre para ajustes visuales finos.
3. El root layout (`src/app/layout.js`) los lee en el server (`loadOverrides`), inyecta el CSS
   como `<style>` (sin flicker) y pasa el JSON a `OverridesProvider`.
4. Los componentes leen el override con su **id** y caen al **default** si no hay override.
5. Si la carpeta no está montada → no carga nada → la web usa sus defaults (degradación limpia).

> La config es estática por instancia: un cambio en los archivos requiere **reiniciar el server**.

## El contrato: los ids NO se "descubren", se crean

Las clases de Tailwind son hasheadas y cambian en cada build, así que **no** se usan como ancla.
El contrato lo fabricamos a mano:

- **Elemento fijo en el código** → se le pone `data-cust="<id>"` una sola vez.
- **Data dinámica** (nav, eventos del CMS) → se usa el id estable que ya da Strapi
  (`documentId`/slug) o una clave fija para items hardcodeados, expuesta como `id` en el item.

Solo se ancla lo que un cliente **realmente** pide cambiar. Cada id nuevo se anota en el catálogo
de abajo.

## Esquema de `overrides.json`

```json
{
  "hide":   ["hero-cta"],
  "text":   { "footer-kwb": "Texto nuevo" },
  "links":  { "nav-contact": "https://wa.me/507...", "footer-kwb": "https://ejemplo.com" },
  "hiddenFields": { "checkout": ["phone"] }
}
```

## API para el código

```js
// Componente cliente
import { useOverrides } from '@/app/overrides/OverridesProvider';
const { getText, getLink, isHidden, getHiddenFields } = useOverrides();

// Texto:   <span>{getText('footer-kwb', 'Kosher Without Borders')}</span>
// Link:    <a href={getLink('footer-kwb', 'https://kosherwithoutborders.com')}>...</a>
// Form:    const hidden = getHiddenFields('checkout'); // ['phone'] -> no render/valida/envía

// Data-driven (server o client):
import { applyLinkOverrides } from '@/app/overrides/applyOverrides';
menuItems = applyLinkOverrides(menuItems, config.links); // remapea path por item.id
```

## Catálogo de anclas (ids registrados)

_Aún vacío. Cada vez que se ancle un elemento, registrarlo aquí: `id` · dónde vive · qué cambia._

> **Nav (header):** todos los ids `nav-*` soportan **cambiar link** (`links`) y **ocultar**
> (`hide` / `data-cust`). Funcionan igual en desktop y mobile. Los items dinámicos usan el
> `documentId` de Strapi: páginas → `nav-page-<documentId>`, eventos → `nav-event-<documentId>`.

| id | Ubicación | Qué controla |
|----|-----------|--------------|
| `nav-chabad-house` | `header/HeaderClient.js` | Item "Chabad House" del nav (+ su dropdown) |
| `nav-about` | `header/HeaderClient.js` | Sub-item "About us" |
| `nav-visitor-info` | `header/HeaderClient.js` | Sub-item "Visitor Information" |
| `nav-visiting` | `header/HeaderClient.js` | Item "Visiting [País]" (+ dropdown) |
| `nav-activities` | `header/HeaderClient.js` | Sub-item "Activities" |
| `nav-accommodations` | `header/HeaderClient.js` | Sub-item "Accommodations" |
| `nav-packages` | `header/HeaderClient.js` | Sub-item "Packages" |
| `nav-kosher-food` | `header/HeaderClient.js` | Item "Kosher Food" (+ dropdown) |
| `nav-shabbat-meals` | `header/HeaderClient.js` | Sub-item "Shabbat Meals" |
| `nav-restaurants` | `header/HeaderClient.js` | Sub-item "Restaurants" |
| `nav-more` | `header/HeaderClient.js` | Dropdown "More" |
| `nav-contact` | `header/HeaderClient.js` | Item "Contact" |
| `nav-page-<documentId>` | `header/HeaderClient.js` | Página custom dinámica del nav |
| `nav-event-<documentId>` | `header/HeaderClient.js` | Evento custom dinámico del nav |
| `home-hero` | `components/sections/Home/hero.js` | Sección Hero del home (ocultar/reestilar) |
| `home-announces` | `components/sections/Home/announces.js` | Sección de anuncios |
| `home-about` | `components/sections/Home/aboutHome.js` | Sección About del home |
| `home-attractions` | `components/sections/Home/attractionsHome.js` | Sección de atracciones |
| `home-packages` | `components/sections/Home/packagesHome.js` | Sección de packages |
| `home-packages-video` | `components/sections/Home/packagesVideo.js` | Video de packages |
| `home-custom-video` | `components/sections/Home/customVideoHome.js` | Video custom del home |
| `footer-col-{main,activities,kosher,attractions,help,legal}` | `layout/footer.js` | Columna del footer (ocultar / cambiar título con `text`) |
| `footer-link-{home,about,contact,donations,restaurants,activities,packages,accommodations,shabbatbox,shabbat-meals,tourist-info,whatsapp-group,terms,privacy}` | `layout/footer.js` | Cada link del footer (ocultar / cambiar texto / cambiar link) |
| `footer-social-{facebook,instagram,whatsapp}` | `layout/footer.js` | Iconos de redes (ocultar) |
| `footer-credit` | `layout/footer.js` | Toda la línea "Powered by..." (ocultar) |
| `footer-kwb` | `layout/footer.js` | El link "Kosher Without Borders" (texto + link) |

### Checkout — campos del form (`hiddenFields`)

Se ocultan con `hiddenFields.checkout` (no se renderizan, no validan, se mandan vacíos). formId = `checkout`.

```json
{ "hiddenFields": { "checkout": ["phone", "donation"] } }
```

| Campo | Notas |
|-------|-------|
| `phone` | Teléfono (ocultable sin problema) |
| `nationality` | Nacionalidad (solo si está habilitada) |
| `donation` | Donación opcional |
| `coverFees` | Checkbox "cubrir comisiones" |
| `sponsorship` | Patrocinio (modo Korea) |
| `agreeUpdates` | Consentimiento de updates |
| `koreaConnection` · `localPhone` · `judaismConnection` | Campos del modo Korea |
| ⚠️ `firstName` · `lastName` | Se puede, pero la orden queda sin nombre |
| ⚠️ `email` | Se puede, pero **sin email no llega la confirmación** |
| ⚠️ `agreeTerms` | Se puede, pero es el consentimiento legal de términos |
