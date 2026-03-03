-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================
-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- PRODUCTS TABLE POLICIES
-- =============================================
-- Everyone can view active products
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

-- Admins can do everything with products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- ORDERS TABLE POLICIES
-- =============================================
-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update orders
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- SUBSCRIPTIONS TABLE POLICIES
-- =============================================
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- LICENSES TABLE POLICIES
-- =============================================
-- Users can view their own licenses
CREATE POLICY "Users can view own licenses"
  ON public.licenses FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can manage all licenses
CREATE POLICY "Admins can manage licenses"
  ON public.licenses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- COUPONS TABLE POLICIES
-- =============================================
-- Authenticated users can view active coupons
CREATE POLICY "Users can view active coupons"
  ON public.coupons FOR SELECT
  USING (is_active = TRUE AND auth.role() = 'authenticated');

-- Admins can manage coupons
CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- AFFILIATES TABLE POLICIES
-- =============================================
-- Users can view their own affiliate data
CREATE POLICY "Users can view own affiliate data"
  ON public.affiliates FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own affiliate account
CREATE POLICY "Users can create affiliate account"
  ON public.affiliates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage affiliates
CREATE POLICY "Admins can manage affiliates"
  ON public.affiliates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- AFFILIATE EARNINGS TABLE POLICIES
-- =============================================
-- Affiliates can view their own earnings
CREATE POLICY "Affiliates can view own earnings"
  ON public.affiliate_earnings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliates
      WHERE id = affiliate_id AND user_id = auth.uid()
    )
  );

-- Admins can manage earnings
CREATE POLICY "Admins can manage earnings"
  ON public.affiliate_earnings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- DOWNLOADS TABLE POLICIES
-- =============================================
-- Users can view their own downloads
CREATE POLICY "Users can view own downloads"
  ON public.downloads FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create download records
CREATE POLICY "Users can create download records"
  ON public.downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all downloads
CREATE POLICY "Admins can view all downloads"
  ON public.downloads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- REFUNDS TABLE POLICIES
-- =============================================
-- Users can view their own refunds
CREATE POLICY "Users can view own refunds"
  ON public.refunds FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create refund requests
CREATE POLICY "Users can create refund requests"
  ON public.refunds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage refunds
CREATE POLICY "Admins can manage refunds"
  ON public.refunds FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- ANALYTICS EVENTS TABLE POLICIES
-- =============================================
-- Users can create analytics events
CREATE POLICY "Users can create analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

-- Admins can view all analytics
CREATE POLICY "Admins can view analytics"
  ON public.analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
