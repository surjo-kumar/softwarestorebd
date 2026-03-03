-- Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_provider TEXT DEFAULT 'stripe'
);

-- Enable RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for public to insert orders (for checkout)
-- Note: In a real app, you might restrict this more or use a service role for creation
CREATE POLICY "Enable insert for everyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for users based on email" ON public.orders FOR SELECT USING (customer_email = current_user); -- Simplistic, needs auth

-- Create Purchases Table (for file access)
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  user_email TEXT NOT NULL
);

-- Enable RLS for Purchases
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
