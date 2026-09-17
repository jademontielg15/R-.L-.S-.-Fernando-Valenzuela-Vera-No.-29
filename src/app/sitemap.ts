import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://fvv29.com.mx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Rutas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/historia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/masoneria`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ingresa`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/revista`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/knights-builders`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/aviso-de-privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Rutas dinámicas: documentos visibles
  try {
    const { data: documentos } = await supabase
      .from('documentos')
      .select('id, actualizado_en')
      .eq('visible', true)
      .order('actualizado_en', { ascending: false });

    const dinamicRoutes: MetadataRoute.Sitemap = (documentos || []).map((doc) => ({
      url: `${BASE_URL}/revista/${doc.id}`,
      lastModified: new Date(doc.actualizado_en),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...dinamicRoutes];
  } catch (error) {
    console.error('Error generando sitemap:', error);
    // Si hay error, retornar solo rutas estáticas
    return staticRoutes;
  }
}
