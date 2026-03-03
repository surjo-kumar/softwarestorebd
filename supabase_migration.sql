-- Create Categories Table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Categories
insert into categories (name, slug) values
('Software', 'software'),
('Subscription', 'subscription'),
('Games', 'games'),
('Courses', 'courses'),
('E-Books', 'ebooks'),
('Gift Cards', 'giftcards'),
('Other', 'other')
on conflict do nothing;

-- Create Coupons Table
create table if not exists coupons (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  discount_amount numeric not null,
  discount_type text check (discount_type in ('percentage', 'fixed')) not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
