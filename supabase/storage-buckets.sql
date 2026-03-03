-- =============================================
-- STORAGE BUCKETS CONFIGURATION
-- =============================================

-- Create product-files bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create thumbnails bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STORAGE POLICIES FOR product-files (PRIVATE)
-- =============================================

-- Only authenticated users who purchased the product can download
CREATE POLICY "Users can download purchased products"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'product-files' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.products p ON o.product_id = p.id
    WHERE o.user_id = auth.uid()
      AND o.status = 'completed'
      AND storage.foldername(name)[1] = p.category
      AND p.file_path = name
  )
);

-- Admins can upload product files
CREATE POLICY "Admins can upload product files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-files' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update product files
CREATE POLICY "Admins can update product files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-files' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can delete product files
CREATE POLICY "Admins can delete product files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-files' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =============================================
-- STORAGE POLICIES FOR thumbnails (PUBLIC)
-- =============================================

-- Anyone can view thumbnails
CREATE POLICY "Anyone can view thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

-- Admins can upload thumbnails
CREATE POLICY "Admins can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update thumbnails
CREATE POLICY "Admins can update thumbnails"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can delete thumbnails
CREATE POLICY "Admins can delete thumbnails"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);
