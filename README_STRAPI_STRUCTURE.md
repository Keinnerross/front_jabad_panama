# 🚀 Estructura de API Strapi v5 - Frontend

## 📁 Estructura de Archivos

```
src/app/
├── services/
│   └── strapiApi.js          # Servicio centralizado de API
├── customHooks/
│   └── useStrapiData.js      # Hooks personalizados para datos
└── components/
    └── sections/Home/
        └── aboutHome.js      # Componente migrado (ejemplo)
```

## 🔧 Cómo Usar

### 1. Importar el Hook Específico
```javascript
import { useAboutUs } from "@/app/customHooks/useStrapiData.js"

const { data, loading, error } = useAboutUs();
```

### 2. Usar Datos en el Componente
```javascript
// Acceso a datos
const aboutData = data?.data?.home_about;

// Campos simples
aboutData?.title
aboutData?.description_1
aboutData?.whatsapp_group_link

// Imágenes (máximo 3)
aboutData?.pictures?.[0]?.url
aboutData?.pictures?.[1]?.url  
aboutData?.pictures?.[2]?.url

// Lista de items
aboutData?.item_list?.map(item => item.text)
```

## 🎯 Hooks Disponibles

### `useAboutUs()`
- **Cache:** 10 minutos
- **Populate:** `pictures`, `item_list`
- **Uso:** Página About/Home

### `useRestaurants(filters)`
- **Cache:** 5 minutos  
- **Populate:** `images`, `category`, `location`
- **Uso:** Lista de restaurantes

### `useHotels(filters)`
- **Cache:** 5 minutos
- **Populate:** `gallery`, `amenities`, `location`
- **Uso:** Lista de hoteles

### `useActivities(filters)`
- **Cache:** 5 minutos
- **Populate:** `images`, `details.gallery`, `details.inclusions`
- **Uso:** Lista de actividades

### `usePackages(filters)`
- **Cache:** 5 minutos
- **Populate:** `hero_section`, `included_services`, `gallery`
- **Uso:** Lista de paquetes

## 🔧 Configuraciones de Populate

### About Us
```javascript
{
  home_about: {
    populate: {
      pictures: true,
      item_list: true
    }
  }
}
```

### Restaurantes
```javascript
{
  images: true,
  category: true,
  location: true
}
```

## 📝 Estructura de Respuesta

### About Us
```javascript
{
  data: {
    home_about: {
      title: "string",
      primary_description: "string", 
      description_1: "string",
      description_2: "string",
      whatsapp_group_link: "string",
      pictures: [
        { url: "/uploads/image1.jpg" },
        { url: "/uploads/image2.jpg" },
        { url: "/uploads/image3.jpg" }
      ],
      item_list: [
        { text: "Feature 1" },
        { text: "Feature 2" },
        { text: "Feature 3" }
      ]
    }
  }
}
```

## 🚀 Agregar Nuevos Endpoints

### 1. Actualizar `POPULATE_CONFIGS` en `strapiApi.js`
```javascript
export const POPULATE_CONFIGS = {
  // ... configs existentes
  newEndpoint: {
    images: true,
    details: {
      populate: {
        gallery: true,
        features: true
      }
    }
  }
};
```

### 2. Agregar función en `strapiEndpoints`
```javascript
export const strapiEndpoints = {
  // ... endpoints existentes
  getNewEndpoint: (filters = {}) => strapiApi('new-endpoint', {
    populate: POPULATE_CONFIGS.newEndpoint,
    filters
  })
};
```

### 3. Crear hook específico en `useStrapiData.js`
```javascript
export const useNewEndpoint = (filters = {}) => {
  const strapiEndpoints = require('../services/strapiApi').default;
  
  return useStrapiData(
    () => strapiEndpoints.getNewEndpoint(filters),
    {
      cacheKey: `new-endpoint-${JSON.stringify(filters)}`,
      cacheTime: 5 * 60 * 1000
    }
  );
};
```

## 🎛️ Características

### ✅ Cache Inteligente
- Cache automático por endpoint
- Tiempo configurable por hook
- Función `clearCache()` disponible

### ✅ Estados de Loading/Error
- Estados automáticos de `loading` y `error`
- UI components para cada estado
- Logging automático de requests

### ✅ Flexibilidad
- Filtros dinámicos por endpoint
- Configuraciones de populate predefinidas
- Función `getCustom()` para casos especiales

### ✅ Performance
- URLs optimizadas para Strapi v5
- Populate específico (no over-fetching)
- Cache para reducir requests

## 🔍 Debug

### Console Logs Automáticos
- 🚀 Request URL
- ✅ Response data  
- ❌ Errores
- 📦 Cache hits

### Verificar Datos
```javascript
const { data, loading, error } = useAboutUs();
console.log('Data:', data);
console.log('Loading:', loading);
console.log('Error:', error);
```

## 🌐 Variables de Entorno

Crear `.env.local`:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## 📋 TODO para Nuevos Endpoints

1. ✅ Identificar campos y relaciones necesarias
2. ✅ Agregar configuración en `POPULATE_CONFIGS`
3. ✅ Crear función en `strapiEndpoints`
4. ✅ Crear hook específico
5. ✅ Migrar componente para usar el hook
6. ✅ Agregar states de loading/error
7. ✅ Testear y documentar