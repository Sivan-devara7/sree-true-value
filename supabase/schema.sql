-- ============================================================
-- SREE TRUE VALUE — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Cars / Vehicle Listings
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Info
  title TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT,
  year INTEGER NOT NULL,

  -- Pricing
  price NUMERIC(12, 2) NOT NULL,
  original_price NUMERIC(12, 2),

  -- Specs
  mileage INTEGER, -- km driven
  fuel_type TEXT CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'LPG')),
  transmission TEXT CHECK (transmission IN ('Manual', 'Automatic', 'CVT', 'DCT', 'AMT')),
  body_type TEXT CHECK (body_type IN ('Sedan', 'Hatchback', 'SUV', 'MUV', 'Coupe', 'Convertible', 'Pickup', 'Van', 'Minivan')),
  color TEXT,
  seats INTEGER DEFAULT 5,

  -- Registration
  registration_year INTEGER,
  registration_state TEXT DEFAULT 'AP',
  owners INTEGER DEFAULT 1, -- number of previous owners

  -- Additional Info
  description TEXT,
  features TEXT[] DEFAULT '{}',
  insurance_validity DATE,

  -- Media
  images TEXT[] DEFAULT '{}', -- Supabase Storage public URLs

  -- Status
  is_featured BOOLEAN DEFAULT FALSE,
  is_sold BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  -- SEO
  slug TEXT UNIQUE
);

-- Inquiries / Contact Form
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  car_title TEXT,

  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,

  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'phone', 'walkin'))
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cars_make ON cars(make);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_body_type ON cars(body_type);
CREATE INDEX IF NOT EXISTS idx_cars_transmission ON cars(transmission);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_is_featured ON cars(is_featured);
CREATE INDEX IF NOT EXISTS idx_cars_is_sold ON cars(is_sold);
CREATE INDEX IF NOT EXISTS idx_cars_is_active ON cars(is_active);
CREATE INDEX IF NOT EXISTS idx_inquiries_car_id ON inquiries(car_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slug from title + year
CREATE OR REPLACE FUNCTION generate_car_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := LOWER(REGEXP_REPLACE(NEW.year || '-' || NEW.make || '-' || NEW.model || '-' || COALESCE(NEW.variant, ''), '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := TRIM(BOTH '-' FROM base_slug);
    final_slug := base_slug;

    WHILE EXISTS (SELECT 1 FROM cars WHERE slug = final_slug AND id != NEW.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;

    NEW.slug := final_slug;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_slug_on_insert
  BEFORE INSERT ON cars
  FOR EACH ROW
  EXECUTE FUNCTION generate_car_slug();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Public can read active, non-deleted cars
CREATE POLICY "Public can view active cars"
  ON cars FOR SELECT
  USING (is_active = TRUE);

-- Only authenticated admins can insert/update/delete cars
CREATE POLICY "Admin can insert cars"
  ON cars FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update cars"
  ON cars FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete cars"
  ON cars FOR DELETE
  USING (auth.role() = 'authenticated');

-- Public can insert inquiries
CREATE POLICY "Anyone can submit inquiry"
  ON inquiries FOR INSERT
  WITH CHECK (TRUE);

-- Only authenticated admin can view/manage inquiries
CREATE POLICY "Admin can view inquiries"
  ON inquiries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update inquiries"
  ON inquiries FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Run in Supabase dashboard or SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Storage policies (run after creating bucket)
-- CREATE POLICY "Public can view car images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'car-images');

-- CREATE POLICY "Admin can upload car images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');

-- CREATE POLICY "Admin can delete car images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'car-images' AND auth.role() = 'authenticated');

-- ============================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================
INSERT INTO cars (title, make, model, variant, year, price, original_price, mileage, fuel_type, transmission, body_type, color, seats, description, features, is_featured, registration_state, owners)
VALUES
  ('2021 Maruti Suzuki Swift VXI', 'Maruti Suzuki', 'Swift', 'VXI', 2021, 650000, 720000, 35000, 'Petrol', 'Manual', 'Hatchback', 'Pearl Arctic White', 5, 'Well-maintained Swift VXI with full service history. Single owner, nonsmoker. All original parts, no accidents.', ARRAY['Power Steering', 'Power Windows', 'Central Locking', 'ABS', 'Airbags', 'Reverse Camera', 'Bluetooth Music'], TRUE, 'AP', 1),
  ('2020 Hyundai Creta SX', 'Hyundai', 'Creta', 'SX', 2020, 1250000, 1400000, 52000, 'Petrol', 'Automatic', 'SUV', 'Typhoon Silver', 5, 'Loaded Creta SX with sunroof and all features. Company maintained with service records. Excellent condition.', ARRAY['Sunroof', 'Wireless Charging', 'Ventilated Seats', 'BlueLink Connected Car', '360° Camera', 'Cruise Control', 'Leather Seats'], TRUE, 'AP', 1),
  ('2019 Honda City ZX', 'Honda', 'City', 'ZX', 2019, 850000, 950000, 68000, 'Petrol', 'CVT', 'Sedan', 'Radiant Red', 5, 'Top-end City ZX CVT. All original paint, no major repairs. Regular Honda service center maintained.', ARRAY['Sunroof', 'Leather Seats', 'Navigation', 'Apple CarPlay', 'Android Auto', 'Lane Watch Camera', 'Cruise Control'], TRUE, 'AP', 1);
