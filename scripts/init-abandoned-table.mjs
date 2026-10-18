import { query } from '../lib/db.ts';

async function init() {
  await query(`
    CREATE TABLE IF NOT EXISTS abandoned_checkouts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      phone VARCHAR(20) NOT NULL,
      customer_name VARCHAR(255),
      email VARCHAR(255),
      pet_name VARCHAR(255),
      pet_type VARCHAR(50) DEFAULT 'dog',
      pet_size VARCHAR(50) DEFAULT 'small',
      pet_breed VARCHAR(255),
      service_summary TEXT,
      services_json JSONB,
      check_in_date VARCHAR(50),
      drop_off_time VARCHAR(50),
      total_amount INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'abandoned',
      last_step VARCHAR(100),
      razorpay_order_id VARCHAR(255),
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_abandoned_phone ON abandoned_checkouts(phone);
    CREATE INDEX IF NOT EXISTS idx_abandoned_status ON abandoned_checkouts(status);

    INSERT INTO offers (code, title, description, discount_percent, min_days, is_active)
    VALUES ('COMEBACK100', '₹100 Abandoned Checkout Recovery Discount', 'Get ₹100 flat discount when completing your reserved checkout.', 0, 1, true)
    ON CONFLICT (code) DO NOTHING;
  `);
  console.log('abandoned_checkouts table & COMEBACK100 offer initialized in Neon DB.');
  process.exit(0);
}

init().catch((err) => {
  console.error('Failed to init table & offers:', err);
  process.exit(1);
});
