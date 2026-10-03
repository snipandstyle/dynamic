import pg from 'pg';
const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_3qjRoXa7fSHP@ep-cool-union-b3c54tp8-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('Connecting to Neon PostgreSQL...');

  // 1. Ensure tables exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS organizations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
      full_name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(255),
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'customer',
      is_phone_verified BOOLEAN DEFAULT false,
      is_email_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS pets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      species VARCHAR(50) NOT NULL,
      breed VARCHAR(255),
      age_years INT,
      gender VARCHAR(20),
      weight_kg NUMERIC(5,2),
      special_instructions TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS offers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      discount_percent INT DEFAULT 0,
      min_days INT DEFAULT 1,
      is_active BOOLEAN DEFAULT true,
      valid_until DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      booking_ref VARCHAR(50) UNIQUE NOT NULL,
      organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      pet_name VARCHAR(255) NOT NULL,
      pet_breed VARCHAR(255),
      pet_weight_kg NUMERIC(5,2),
      service_type VARCHAR(255) NOT NULL,
      services_json JSONB,
      check_in_date DATE NOT NULL,
      check_out_date DATE,
      drop_off_time VARCHAR(50),
      pickup_time VARCHAR(50),
      number_of_days INT DEFAULT 1,
      base_amount_paise INT NOT NULL,
      discount_amount_paise INT DEFAULT 0,
      addons_amount_paise INT DEFAULT 0,
      total_amount_paise INT NOT NULL,
      status VARCHAR(50) DEFAULT 'confirmed',
      payment_status VARCHAR(50) DEFAULT 'pending',
      payment_method VARCHAR(50) DEFAULT 'razorpay',
      razorpay_order_id VARCHAR(255),
      razorpay_payment_id VARCHAR(255),
      razorpay_signature VARCHAR(255),
      applied_offer_code VARCHAR(50),
      is_highway_early_dropoff BOOLEAN DEFAULT true,
      departure_grooming_wash BOOLEAN DEFAULT false,
      emergency_contact VARCHAR(100),
      special_instructions TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('Tables verified.');

  // 2. Add services_json column to bookings if missing (for multiple services!)
  await pool.query(`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'services_json') THEN
        ALTER TABLE bookings ADD COLUMN services_json JSONB;
      END IF;
    END $$;
  `);

  // 3. Make email in users nullable if not already
  await pool.query(`
    ALTER TABLE users ALTER COLUMN email DROP NOT NULL;
  `);

  // 4. Ensure default organization
  let orgRes = await pool.query('SELECT id FROM organizations LIMIT 1');
  let orgId = orgRes.rows[0]?.id;
  if (!orgId) {
    const newOrg = await pool.query(
      "INSERT INTO organizations (name, slug) VALUES ('Snip & Style Pet Sanctuary', 'snip-and-style') RETURNING id"
    );
    orgId = newOrg.rows[0].id;
  }

  // 5. Seed / Update Proper Coupons
  const coupons = [
    {
      code: 'ROYALPET15',
      title: '15% Ad Privilege Special',
      description: 'Flat 15% discount on all dog & cat boarding stays and spa grooming packages.',
      discount_percent: 15,
      min_days: 1,
    },
    {
      code: 'SNIPVIP20',
      title: '20% VIP Privilege Code',
      description: 'Exclusive 20% discount on complete grooming packages and extended boarding stays.',
      discount_percent: 20,
      min_days: 1,
    },
    {
      code: 'PUPPY25',
      title: '25% Puppy & Kitten Intro Offer',
      description: '25% off first gentle grooming session or first daycare stay for puppies and kittens under 1 year.',
      discount_percent: 25,
      min_days: 1,
    },
    {
      code: 'FREESPA',
      title: 'FREE Furry Fresh Spa Refresh Voucher',
      description: 'Complimentary ₹749 Furry Fresh Spa Refresh with high-velocity blow dry & ear/eye hygiene on 4+ nights.',
      discount_percent: 100,
      min_days: 4,
    },
    {
      code: 'PETCAB50',
      title: '50% OFF Doorstep AC Pet Cab',
      description: 'Save 50% on chauffeur pickup & drop across South Bangalore, Kanakapura Road, JP Nagar, and Jayanagar.',
      discount_percent: 50,
      min_days: 1,
    },
    {
      code: 'LONGSTAY10',
      title: '10% Extended Vacation Stay Bonus',
      description: 'Extra 10% discount on boarding stays longer than 7 nights.',
      discount_percent: 10,
      min_days: 7,
    },
  ];

  for (const c of coupons) {
    await pool.query(
      `INSERT INTO offers (organization_id, code, title, description, discount_percent, min_days, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       ON CONFLICT (code) DO UPDATE
       SET title = EXCLUDED.title,
           description = EXCLUDED.description,
           discount_percent = EXCLUDED.discount_percent,
           min_days = EXCLUDED.min_days,
           is_active = true`,
      [orgId, c.code, c.title, c.description, c.discount_percent, c.min_days]
    );
  }

  const allOffers = await pool.query('SELECT code, title, discount_percent, is_active FROM offers WHERE is_active = true');
  console.log('ACTIVE COUPONS IN NEON DB:');
  console.table(allOffers.rows);

  await pool.end();
  console.log('Database successfully migrated and coupons primed!');
}

main().catch(console.error);
