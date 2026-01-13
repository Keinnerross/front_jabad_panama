# Revisión General del Sitio - Reporte Completo

**Fecha:** 29 de Noviembre, 2025
**Proyecto:** front_chabad (Next.js + Strapi)

---

## Resumen Ejecutivo

Se identificaron **20 problemas principales** organizados en 4 niveles de urgencia:

| Urgencia | Cantidad | Tiempo Est. | Impacto |
|----------|----------|-------------|---------|
| CRÍTICO | 4 | 40 min | Seguridad comprometida |
| ALTO | 4 | 75 min | Vulnerabilidades + Performance |
| MEDIO | 7 | 84 min | Calidad + SEO |
| BAJO | 5 | 135 min | UX + SEO avanzado |

---

## CRÍTICO - Seguridad (Acción Inmediata)

### 1. Secrets expuestos en archivos .env

**Archivos afectados:**
- `.env`
- `.env.local`
- `.env.development.local`

**Problema:** Claves reales de Stripe, Strapi y email están en control de versiones:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRAPI_API_TOKEN`
- `EMAIL_PASS`

**Riesgo:** Cualquier persona con acceso al repositorio puede acceder al procesamiento de pagos, CMS y envío de emails.

**Acción requerida:**
1. Rotar TODAS las credenciales inmediatamente
2. Regenerar keys en Stripe Dashboard, Strapi Admin y Gmail
3. Asegurar que `.env.local` esté en `.gitignore`
4. Considerar usar `git-filter-repo` para limpiar historial de git

---

### 2. Token de Strapi expuesto al cliente

**Archivo:** `src/app/services/strapiApiFetch.js:16`

**Problema:** `NEXT_PUBLIC_STRAPI_API_TOKEN` es visible en el navegador (el prefijo `NEXT_PUBLIC_` hace que se incluya en el bundle del cliente).

**Riesgo:** Cualquier usuario puede acceder al CMS con el token completo.

**Solución:**
```javascript
// Cambiar de:
const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// A:
const token = process.env.STRAPI_API_TOKEN; // Sin NEXT_PUBLIC_
```

Mover todas las llamadas de Strapi a Server Components o API routes.

---

### 3. Endpoint /api/payment-success sin autenticación

**Archivo:** `src/app/api/payment-success/route.js`

**Problema:** Cualquiera puede consultar sesiones de Stripe pasando un `session_id`:
```javascript
export async function GET(request) {
  const sessionId = searchParams.get('session_id'); // Sin validación
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return Response.json(sessionData); // Expone email, metadata, etc.
}
```

**Riesgo:** Exposición de información de clientes (email, teléfono, nacionalidad, detalles de pedido).

**Solución:**
- Agregar validación de que el usuario es dueño de la sesión
- Limitar datos expuestos en la respuesta
- Agregar rate limiting

---

### 4. Validación de webhook secret incompleta

**Archivo:** `src/app/api/webhooks/stripe/route.js:22`

**Problema:** No valida que `endpointSecret` existe antes de usarlo:
```javascript
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
// Si está vacío, constructEvent() aceptará cualquier request
```

**Solución:**
```javascript
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!endpointSecret) {
  console.error('STRIPE_WEBHOOK_SECRET not configured');
  return Response.json({ error: 'Server misconfigured' }, { status: 500 });
}
```

---

## ALTO - Seguridad + Rendimiento

### 5. Sin protección CSRF en endpoints POST

**Archivos afectados:**
- `src/app/api/checkout/route.js`
- `src/app/api/create-subscription/route.js`
- `src/app/api/contact/submit/route.js`
- `src/app/api/newsletter/subscribe/route.js`

**Problema:** No hay validación de tokens CSRF en formularios.

**Solución:** Implementar validación de origen o tokens CSRF en todos los POST.

---

### 6. Validación de precios del lado cliente

**Archivos:**
- `src/app/api/checkout/route.js`
- `src/app/api/create-subscription/route.js`

**Problema:** Los precios vienen directamente del cliente sin validar contra un catálogo en el servidor.

**Riesgo:** Manipulación de precios - un atacante podría modificar el precio antes de enviar.

**Solución:** Validar precios contra base de datos antes de crear sesión de Stripe.

---

### 7. Llamadas API duplicadas - Header

**Archivos:**
- `src/app/layout.js` - llama `api.siteConfig()`
- `src/app/components/layout/header.js:6` - llama `api.siteConfig()` OTRA VEZ

**Problema:** Se hace la misma llamada 2 veces por cada carga de página.

**Solución:** Eliminar el fetch en `header.js` - ya recibe los datos como prop.

---

### 8. Tracking de sesiones en memoria

**Archivo:** `src/app/api/process-success/route.js:23-24`

```javascript
const processedSessions = new Set();
```

**Problemas:**
- Se pierde en restart del servidor
- En multi-instancia, cada servidor tiene su propio Set
- Race conditions posibles
- Sin TTL - memoria puede crecer indefinidamente

**Solución:** Usar Redis o verificar directamente en Stripe metadata.

---

## MEDIO - Calidad de Código + SEO

### 9. Archivos backup sin usar

**Archivos a eliminar:**
- `src/app/components/layout/header/HeaderClientBackup.js`
- `src/app/api/process-success/route.js.backup`
- `src/app/api/webhooks/stripe/route.js.backup`

---

### 10. Código duplicado - copiesPages

**Archivo:** `src/app/services/strapiApiFetch.js:159-160`

```javascript
copiesPages: () => strapiFetch("/content-page?..."),  // Línea 159
copiesPages: () => strapiFetch("/content-page?..."),  // Línea 160 - DUPLICADO
```

---

### 11. Formato de respuesta API inconsistente

**Archivo:** `src/app/services/strapiApiFetch.js`

**Problema:**
- Éxito retorna: `data` directamente
- Error retorna: `{ data: null, error: { message } }`

**Solución:** Estandarizar a siempre retornar `{ data, error }`.

---

### 12. Metadata faltante en páginas dinámicas

**Archivos:**
- `src/app/(pages)/(entries)/(restaurants)/single-restaurant/[id]/page.js`
- `src/app/(pages)/(entries)/(activities)/single-activities/[id]/page.js`
- `src/app/(pages)/(entries)/(hotels)/single-hotel/[id]/page.js`

**Problema:** No tienen función `generateMetadata` para SEO dinámico.

**Solución:**
```javascript
export async function generateMetadata({ params }) {
  const data = await api.singleRestaurant(params.id);
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.imageUrl],
    },
  };
}
```

---

### 13. Dominios hardcodeados en SEO

**Archivos:**
- `src/app/robots.js:8`
- `src/app/sitemap.js:2`

**Problema:** URL hardcodeada `https://chabad.kosherwithoutborders.com`

**Solución:**
```javascript
const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://chabad.kosherwithoutborders.com';
```

---

### 14. ARIA labels faltantes

**Archivos afectados:**
- Navigation dropdowns
- Filter buttons en `entryLayout.js`
- Pagination buttons
- Carousel controls

**Problema:** Elementos interactivos sin atributos de accesibilidad.

**Solución:** Agregar `aria-label`, `aria-expanded`, `aria-pressed`, `role` donde corresponda.

---

### 15. Console.logs en producción

**Archivos con exceso de logs:**
- `src/app/services/strapi-orders.js` - 46 statements
- `src/app/(pages)/(app)/checkout/page.js` - múltiples
- `src/app/components/layout/footer.js`

**Solución:** Remover o envolver en condicional `process.env.NODE_ENV === 'development'`.

---

## BAJO - Mejoras de UX/SEO

### 16. Datos estructurados JSON-LD faltantes

**Impacto:** Sin rich results en Google.

**Solución:** Agregar Schema.org para:
- Organization (Chabad center)
- LocalBusiness (restaurants, hotels)
- Event (Shabbat, holidays)

---

### 17. Sin Error Boundaries

**Problema:** Un error en componente hijo crashea toda la página.

**Solución:** Envolver secciones críticas con React Error Boundary.

---

### 18. Prop drilling excesivo en Header

**Archivo:** `src/app/components/layout/header/HeaderClient.js`

**Problema:** Pasa demasiados props: `data`, `colorTheme`, `customPagesData`, `customEventsData`, `platformSettings`.

**Solución:** Usar Context para `platformSettings` y `colorTheme`.

---

### 19. OG Tags incompletos

**Archivo:** `src/app/layout.js:35-46`

**Faltantes:**
- `og:image`
- `og:type`
- `og:url`
- `twitter:card`
- `twitter:image`

---

### 20. Sitemap estático

**Archivo:** `src/app/sitemap.js`

**Problema:** No refleja contenido dinámico de Strapi.

**Solución:** Hacer fetch de restaurants, activities, hotels y generar URLs dinámicamente.

---

## Orden de Implementación Recomendado

### Fase 1 - Seguridad del Código
1. Token Strapi al cliente → Mover a server-only
2. Endpoint payment-success → Agregar validación
3. Webhook secret validation → Agregar check

### Fase 2 - Mejoras de Alto Impacto
4. API call duplicado en header (5 min)
5. CSRF protection (30 min)
6. Validación de precios server-side (20 min)

### Fase 3 - Limpieza de Código
7. Eliminar archivos backup (2 min)
8. Eliminar copiesPages duplicado (2 min)
9. Limpiar console.logs (10 min)

### Fase 4 - SEO y Calidad
10. Metadata páginas dinámicas (20 min)
11. Dominios hardcodeados (5 min)
12. OG Tags completos (10 min)
13. API response format consistente (15 min)

### Fase 5 - Accesibilidad y UX
14. ARIA labels (30 min)
15. Error boundaries (30 min)
16. JSON-LD structured data (45 min)

---

## Nota Importante sobre Credenciales

**ACCIÓN MANUAL REQUERIDA:** Las credenciales expuestas en `.env` deben rotarse manualmente:

1. **Stripe:** Dashboard → Developers → API keys → Roll keys
2. **Strapi:** Admin → Settings → API Tokens → Regenerate
3. **Email:** Cambiar contraseña de aplicación en Google Account
4. **Webhook:** Stripe Dashboard → Webhooks → Reveal signing secret → Roll secret

Después de rotar, actualizar `.env.local` (que NO debe estar en git).
