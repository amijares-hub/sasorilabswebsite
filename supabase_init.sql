-- 1. CREAR LA TABLA GLOBAL DE PUBLICACIONES
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,       -- URL Limpia, ej: "el-futuro-de-la-ia"
    author TEXT DEFAULT 'SasoriLabs',
    cover_image TEXT,                -- URL de la imagen en tu Storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    read_time NUMERIC DEFAULT 5,     -- Minutos de lectura
    views NUMERIC DEFAULT 0,         -- Contador de clics
    is_published BOOLEAN DEFAULT true, -- Puedes "ocultar" posts apagando esto
    translations JSONB NOT NULL DEFAULT '{}'::jsonb 
    -- Estructura esperada de Idiomas: { "es": { "title": "x", "content": "x" }, "en": { ... } }
);

-- 2. HABILITAR LA CAPA DE SEGURIDAD (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- 3. PERMITIR AL PÚBLICO VER LOS BLOGS (Lector Común)
CREATE POLICY "Public blogs are viewable by everyone."
ON public.blogs FOR SELECT 
USING (is_published = true);

-- 4. DAR PODER MÁXIMO SOLO A LOS AUTENTICADOS (Super Administrador)
CREATE POLICY "Super Admins can insert blogs"
ON public.blogs FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Super Admins can update blogs"
ON public.blogs FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Super Admins can delete blogs"
ON public.blogs FOR DELETE 
USING (auth.role() = 'authenticated');

-- 5. CONFIGURACIÓN DEL STORAGE PARA IMÁGENES
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "Images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'blog-images' );

create policy "Anyone authenticated can upload images"
on storage.objects for insert
with check ( bucket_id = 'blog-images' AND auth.role() = 'authenticated' );

create policy "Anyone authenticated can update images"
on storage.objects for update
with check ( bucket_id = 'blog-images' AND auth.role() = 'authenticated' );

create policy "Anyone authenticated can delete images"
on storage.objects for delete
using ( bucket_id = 'blog-images' AND auth.role() = 'authenticated' );
