-- Add payment fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT; -- 'pix', 'credit_card'
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'; -- 'approved', 'rejected', 'in_process'
ALTER TABLE orders ADD COLUMN IF NOT EXISTS preference_id TEXT; -- Mercado Pago preference ID
ALTER TABLE orders ADD COLUMN IF NOT EXISTS external_reference TEXT; -- Our internal reference sent to MP
