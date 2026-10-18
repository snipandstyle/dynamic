const { Pool } = require('pg');

const pool = new Pool({
  connectionString: '',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const existing = await pool.query("SELECT id, code FROM offers WHERE code IN ('DASARA20', 'DASARAHOLIDAY')");
  console.log('Existing:', existing.rows);

  if (existing.rows.some(r => r.code === 'DASARA20')) {
    await pool.query(`
      UPDATE offers SET 
        title = 'Dasara Mega Makeover: Flat 20% OFF',
        description = 'Flat 20% off Style Your Pet and Full Grooming packages for Dasara & Ayudha Pooja.',
        discount_percent = 20,
        min_order_amount = '1400',
        applicable_category = 'grooming',
        is_active = true
      WHERE code = 'DASARA20'
    `);
  } else {
    await pool.query(`
      INSERT INTO offers (
        id, organization_id, code, title, description,
        discount_type, discount_percent, discount_amount,
        min_days, min_nights, min_order_amount,
        applicable_category, free_package_name, free_package_value, is_active
      ) VALUES (
        gen_random_uuid(), 'ccbd9625-948b-47c7-862a-eff14aa6c3e1', 'DASARA20',
        'Dasara Mega Makeover: Flat 20% OFF',
        'Flat 20% off Style Your Pet and Full Grooming packages for Dasara & Ayudha Pooja.',
        'percentage', 20, '0',
        1, 0, '1400',
        'grooming', NULL, '0', true
      )
    `);
  }

  if (existing.rows.some(r => r.code === 'DASARAHOLIDAY')) {
    await pool.query(`
      UPDATE offers SET 
        title = 'Dasara Vacation: 1 Night FREE + Free Spa',
        description = 'Book 5+ nights boarding: get 1 night 100% free + complimentary Furry Fresh Spa bath.',
        min_nights = 5,
        min_days = 5,
        discount_amount = '625',
        free_package_name = 'Furry Fresh Spa Bath',
        free_package_value = '749',
        applicable_category = 'boarding',
        is_active = true
      WHERE code = 'DASARAHOLIDAY'
    `);
  } else {
    await pool.query(`
      INSERT INTO offers (
        id, organization_id, code, title, description,
        discount_type, discount_percent, discount_amount,
        min_days, min_nights, min_order_amount,
        applicable_category, free_package_name, free_package_value, is_active
      ) VALUES (
        gen_random_uuid(), 'ccbd9625-948b-47c7-862a-eff14aa6c3e1', 'DASARAHOLIDAY',
        'Dasara Vacation: 1 Night FREE + Free Spa',
        'Book 5+ nights boarding: get 1 night 100% free + complimentary Furry Fresh Spa bath.',
        'flat', 0, '625',
        5, 5, '0',
        'boarding', 'Furry Fresh Spa Bath', '749', true
      )
    `);
  }

  const res = await pool.query("SELECT code, title, discount_percent, discount_amount, min_nights, is_active FROM offers WHERE code IN ('DASARA20', 'DASARAHOLIDAY')");
  console.log('Successfully seeded offers:', res.rows);
  await pool.end();
}

main().catch(err => {
  console.error(err);
  pool.end();
});
