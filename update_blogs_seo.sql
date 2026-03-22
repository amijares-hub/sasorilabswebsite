-- MIGRACION PARA MEJORAS DE DASHBOARD Y SEO
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS author_image TEXT,
ADD COLUMN IF NOT EXISTS seo_score NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS seo_recommendations TEXT[] DEFAULT '{}';

-- Asegurar que todos los blogs actuales sean públicos
UPDATE public.blogs SET is_published = true;
