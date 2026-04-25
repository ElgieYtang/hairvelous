/**
 * Sync PH-market hair product catalog (idempotent, non-destructive).
 *
 * Why this script:
 * - Keeps recommendations grounded in real products commonly sold in PH.
 * - Safe to re-run (updates existing rows, inserts missing ones).
 * - Does NOT wipe user/consultation data.
 *
 * Usage:
 *   node scripts/sync-ph-products.js
 */
const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

const mysqlOpts = getMysqlConnectionOptions();
const database = mysqlOpts.database;

const LOCAL_PH_PRODUCTS = [
  // Local PH brands
  {
    name: 'Gugo Strengthening Shampoo',
    brand: 'Zenutrients',
    description: 'Local PH brand shampoo used for mild cleansing and scalp refresh.',
    price: 349,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Zenutrients_Gugo_Shampoo_PH.jpg',
    categories: ['clarifying/oily scalp'],
  },
  {
    name: 'Apple Cider Vinegar Clarifying Shampoo',
    brand: 'Human Nature',
    description: 'Local PH brand shampoo option for scalp refresh and visible buildup control.',
    price: 249,
    imageUrl: 'https://medias.watsons.com.ph/publishing/HumanNature_ACV_Shampoo_PH.jpg',
    categories: ['anti-dandruff', 'clarifying/oily scalp'],
  },
  {
    name: 'Rosemary Hair Strengthening Shampoo',
    brand: 'Human Nature',
    description: 'Local PH product for gentle cleansing and scalp care in daily routines.',
    price: 249,
    imageUrl: 'https://medias.watsons.com.ph/publishing/HumanNature_Rosemary_Shampoo_PH.jpg',
    categories: ['clarifying/oily scalp'],
  },
  {
    name: 'Premium Keratin Argan Shampoo',
    brand: 'Luxe Organix',
    description: 'Well-known PH retail product for smoother-looking and less frizzy hair.',
    price: 349,
    imageUrl: 'https://medias.watsons.com.ph/publishing/LuxeOrganix_Keratin_Argan_Shampoo_PH.jpg',
    categories: ['anti-frizz'],
  },
  {
    name: 'Scalp Clarify Shampoo',
    brand: 'Luxe Organix',
    description: 'PH drugstore clarifying shampoo for oil and product buildup control.',
    price: 329,
    imageUrl: 'https://medias.watsons.com.ph/publishing/LuxeOrganix_Scalp_Clarify_Shampoo_PH.jpg',
    categories: ['clarifying/oily scalp'],
  },
  {
    name: 'Anti-Frizz Shampoo',
    brand: 'Moringa-O2',
    description: 'PH-market anti-frizz shampoo option from a locally recognized brand.',
    price: 319,
    imageUrl: 'https://medias.watsons.com.ph/publishing/MoringaO2_AntiFrizz_Shampoo_PH.jpg',
    categories: ['anti-frizz', 'moisturizing'],
  },
  {
    name: 'Moisturizing Shampoo with Argan Oil',
    brand: 'Moringa-O2',
    description: 'Local PH-market moisturizing shampoo option for dry-feeling hair.',
    price: 299,
    imageUrl: 'https://medias.watsons.com.ph/publishing/MoringaO2_Moisturizing_Argan_Shampoo_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Triple Keratin Rescue Ultimate Repair Conditioner',
    brand: 'Cream Silk',
    description: 'Widely used local-market conditioner for dry and damaged-looking hair.',
    price: 199,
    imageUrl: 'https://medias.watsons.com.ph/publishing/CreamSilk_TripleKeratin_Conditioner_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Daily Treatment Conditioner',
    brand: 'Cream Silk',
    description: 'Widely available local conditioner option for everyday softness and manageability.',
    price: 179,
    imageUrl: 'https://medias.watsons.com.ph/publishing/CreamSilk_DailyTreatment_Conditioner_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Coconut Hair Butter',
    brand: 'Human Nature',
    description: 'Local PH leave-on treatment option for dry ends and frizz control.',
    price: 199,
    imageUrl: 'https://medias.watsons.com.ph/publishing/HumanNature_Coconut_HairButter_PH.jpg',
    categories: ['moisturizing', 'anti-frizz'],
  },
  {
    name: 'Natural Strengthening Conditioner',
    brand: 'Human Nature',
    description: 'Locally available rinse-off conditioner for smoother daily hair care.',
    price: 249,
    imageUrl: 'https://medias.watsons.com.ph/publishing/HumanNature_Strengthening_Conditioner_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Keratin Treatment Hair Mask',
    brand: 'Luxe Organix',
    description: 'Popular PH beauty-store keratin mask for rough and frizz-prone hair.',
    price: 399,
    imageUrl: 'https://medias.watsons.com.ph/publishing/LuxeOrganix_Keratin_TreatmentMask_PH.jpg',
    categories: ['anti-frizz', 'moisturizing'],
  },
  {
    name: 'Castor Oil Hair Growth Serum',
    brand: 'Luxe Organix',
    description: 'Commonly seen PH hair serum option for scalp care and strand conditioning.',
    price: 349,
    imageUrl: 'https://medias.watsons.com.ph/publishing/LuxeOrganix_Castor_Serum_PH.jpg',
    categories: ['clarifying/oily scalp', 'moisturizing'],
  },
  {
    name: 'Gugo Anti-Hairfall Conditioner',
    brand: 'Zenutrients',
    description: 'Local conditioner option paired with gugo shampoo for breakage-prone routines.',
    price: 349,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Zenutrients_Gugo_Conditioner_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Rosemary Hair Oil',
    brand: 'Human Nature',
    description: 'Local PH scalp-and-hair oil option used in pre-wash or overnight routines.',
    price: 299,
    imageUrl: 'https://medias.watsons.com.ph/publishing/HumanNature_Rosemary_HairOil_PH.jpg',
    categories: ['moisturizing', 'anti-frizz'],
  },
  {
    name: 'Natural Clarifying Shampoo',
    brand: 'Moringa-O2',
    description: 'Locally distributed clarifying shampoo for oily scalp and buildup-prone routines.',
    price: 299,
    imageUrl: 'https://medias.watsons.com.ph/publishing/MoringaO2_Clarifying_Shampoo_PH.jpg',
    categories: ['clarifying/oily scalp'],
  },
];

const GLOBAL_PH_AVAILABLE_PRODUCTS = [
  // Global brands commonly available in PH retail
  {
    name: 'Cool Menthol Anti-Dandruff Shampoo',
    brand: 'Head & Shoulders',
    description: 'Popular anti-dandruff shampoo in PH groceries and drugstores. Helps reduce visible flakes with regular use.',
    price: 329,
    imageUrl: 'https://medias.watsons.com.ph/publishing/HeadShoulders_CoolMenthol_PH.jpg',
    categories: ['anti-dandruff'],
  },
  {
    name: 'Complete Soft Care Anti-Dandruff Shampoo',
    brand: 'Clear',
    description: 'Commonly available anti-dandruff shampoo in Philippine retail chains.',
    price: 229,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Clear_CompleteSoftCare_PH.jpg',
    categories: ['anti-dandruff'],
  },
  {
    name: 'Anti-Dandruff Shampoo',
    brand: 'Sunsilk',
    description: 'Accessible anti-dandruff option in PH supermarkets and convenience stores.',
    price: 189,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Sunsilk_AntiDandruff_PH.jpg',
    categories: ['anti-dandruff'],
  },
  {
    name: 'Intense Repair Shampoo',
    brand: 'Dove',
    description: 'PH-available daily shampoo option for brittle or rough-feeling hair.',
    price: 229,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Dove_IntenseRepair_Shampoo_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Total Damage Care Shampoo',
    brand: 'Pantene',
    description: 'Mainstream PH retail shampoo for daily moisture support and smoother texture.',
    price: 249,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Pantene_TotalDamageCare_Shampoo_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Moisture Recharge Shampoo',
    brand: 'Watsons Naturals',
    description: 'Drugstore-available moisturizing shampoo with lightweight everyday feel.',
    price: 269,
    imageUrl: 'https://medias.watsons.com.ph/publishing/WatsonsNaturals_MoistureRecharge_Shampoo_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Keratin Smooth Shampoo',
    brand: 'TRESemmé',
    description: 'Popular salon-inspired anti-frizz option sold in PH supermarkets and Watsons.',
    price: 289,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Tresemme_KeratinSmooth_Shampoo_PH.jpg',
    categories: ['anti-frizz'],
  },
  {
    name: 'Keratin Smooth Conditioner',
    brand: 'TRESemmé',
    description: 'Companion conditioner for frizz-prone hair; helps improve smoothness and manageability.',
    price: 289,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Tresemme_KeratinSmooth_Conditioner_PH.jpg',
    categories: ['anti-frizz'],
  },
  {
    name: 'Cool & Fresh Shampoo',
    brand: 'Palmolive',
    description: 'Mass-market PH option for fresher-feeling scalp, commonly found in local stores.',
    price: 199,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Palmolive_CoolFresh_Shampoo_PH.jpg',
    categories: ['clarifying/oily scalp'],
  },
  {
    name: 'Smooth and Silky Shampoo',
    brand: 'Head & Shoulders',
    description: 'PH-available anti-dandruff variant with smoother finish for frizz-prone hair.',
    price: 329,
    imageUrl: 'https://medias.watsons.com.ph/publishing/HeadShoulders_SmoothSilky_PH.jpg',
    categories: ['anti-dandruff', 'anti-frizz'],
  },
  {
    name: 'Supreme Moisture Shampoo',
    brand: 'Head & Shoulders',
    description: 'Hydrating anti-dandruff option commonly sold in PH supermarkets.',
    price: 329,
    imageUrl: 'https://medias.watsons.com.ph/publishing/HeadShoulders_SupremeMoisture_PH.jpg',
    categories: ['anti-dandruff', 'moisturizing'],
  },
  {
    name: 'Total Care Anti-Dandruff Shampoo',
    brand: 'Clear',
    description: 'Drugstore and grocery anti-dandruff shampoo with all-around scalp care positioning.',
    price: 229,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Clear_TotalCare_PH.jpg',
    categories: ['anti-dandruff'],
  },
  {
    name: 'Hairfall Defense Shampoo',
    brand: 'Clear',
    description: 'Scalp-cleansing option often available in PH convenience and grocery channels.',
    price: 229,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Clear_HairfallDefense_PH.jpg',
    categories: ['anti-dandruff', 'clarifying/oily scalp'],
  },
  {
    name: 'Smooth and Manageable Shampoo',
    brand: 'Sunsilk',
    description: 'Common PH shampoo choice for frizz-prone hair.',
    price: 189,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Sunsilk_SmoothManageable_PH.jpg',
    categories: ['anti-frizz'],
  },
  {
    name: 'Strong and Long Shampoo',
    brand: 'Sunsilk',
    description: 'Everyday PH-market shampoo for breakage-prone hair routines.',
    price: 189,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Sunsilk_StrongLong_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Hairfall Defense Conditioner',
    brand: 'Dove',
    description: 'Commonly available conditioner in PH stores for weaker hair strands.',
    price: 229,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Dove_HairfallDefense_Conditioner_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Nourishing Oil Care Shampoo',
    brand: 'Dove',
    description: 'Moisturizing shampoo option sold in PH retail for dry-feeling hair.',
    price: 229,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Dove_NourishingOilCare_Shampoo_PH.jpg',
    categories: ['moisturizing', 'anti-frizz'],
  },
  {
    name: 'Hair Fall Control Shampoo',
    brand: 'Pantene',
    description: 'Popular PH retail shampoo for breakage-prone hair routines.',
    price: 249,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Pantene_HairFallControl_Shampoo_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Total Damage Care Conditioner',
    brand: 'Pantene',
    description: 'PH-available conditioner companion for damaged-looking hair.',
    price: 249,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Pantene_TotalDamageCare_Conditioner_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Keratin Smooth Hair Serum',
    brand: 'TRESemmé',
    description: 'Smoothing serum for frizz control available in PH beauty stores and online.',
    price: 359,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Tresemme_KeratinSmooth_Serum_PH.jpg',
    categories: ['anti-frizz'],
  },
  {
    name: 'Keratin Smooth Treatment Mask',
    brand: 'TRESemmé',
    description: 'Deep-conditioning mask option for rough and frizz-prone hair.',
    price: 379,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Tresemme_KeratinSmooth_Mask_PH.jpg',
    categories: ['anti-frizz', 'moisturizing'],
  },
  {
    name: 'Anti-Hairfall Shampoo',
    brand: 'Palmolive',
    description: 'Commonly available PH shampoo option for everyday breakage-care routines.',
    price: 199,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Palmolive_AntiHairfall_Shampoo_PH.jpg',
    categories: ['moisturizing'],
  },
  {
    name: 'Naturals Argan Oil Shampoo',
    brand: 'Palmolive',
    description: 'Accessible moisturizing shampoo variant in PH supermarkets.',
    price: 199,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Palmolive_ArganOil_Shampoo_PH.jpg',
    categories: ['moisturizing', 'anti-frizz'],
  },
  {
    name: 'Tea Tree Purifying Shampoo',
    brand: 'Watsons Naturals',
    description: 'Drugstore-available clarifying shampoo for oily scalp routines.',
    price: 269,
    imageUrl: 'https://medias.watsons.com.ph/publishing/WatsonsNaturals_TeaTree_Shampoo_PH.jpg',
    categories: ['clarifying/oily scalp'],
  },
  {
    name: 'Argan Conditioner',
    brand: 'Watsons Naturals',
    description: 'PH drugstore conditioner for softness and frizz-prone strands.',
    price: 269,
    imageUrl: 'https://medias.watsons.com.ph/publishing/WatsonsNaturals_Argan_Conditioner_PH.jpg',
    categories: ['moisturizing', 'anti-frizz'],
  },
  {
    name: 'Natural Balance Anti-Dandruff Shampoo',
    brand: 'Nizoral',
    description: 'Pharmacy-available anti-dandruff option in PH.',
    price: 399,
    imageUrl: 'https://medias.watsons.com.ph/publishing/Nizoral_AntiDandruff_PH.jpg',
    categories: ['anti-dandruff'],
  },
  {
    name: 'Scalp Purifying Micellar Shampoo',
    brand: 'L’Oréal Paris',
    description: 'Widely distributed clarifying shampoo option in PH retail and online.',
    price: 299,
    imageUrl: 'https://medias.watsons.com.ph/publishing/LOreal_Micellar_Shampoo_PH.jpg',
    categories: ['clarifying/oily scalp'],
  },
  {
    name: 'Elseve Total Repair 5 Shampoo',
    brand: 'L’Oréal Paris',
    description: 'Mainstream repair shampoo for dry and damaged-looking strands.',
    price: 299,
    imageUrl: 'https://medias.watsons.com.ph/publishing/LOreal_TotalRepair5_Shampoo_PH.jpg',
    categories: ['moisturizing'],
  },
];

const USER_CURATED_LOCAL_PH_PRODUCTS = [
  // Shampoo (3)
  {
    name: 'Cool Menthol Anti-Dandruff Shampoo',
    brand: 'Head & Shoulders',
    description: 'Watsons PH anti-dandruff shampoo for visible flakes and scalp freshness.',
    price: 329,
    categories: ['anti-dandruff'],
  },
  {
    name: 'Intense Repair Shampoo',
    brand: 'Dove',
    description: 'Watsons PH shampoo option for rough and damaged-looking hair.',
    price: 229,
    categories: ['moisturizing'],
  },
  {
    name: 'Keratin Smooth Shampoo',
    brand: 'TRESemmé',
    description: 'Watsons PH smoothing shampoo for frizz-prone hair.',
    price: 289,
    categories: ['anti-frizz'],
  },

  // Conditioner (3)
  {
    name: 'Triple Keratin Rescue Ultimate Repair Conditioner',
    brand: 'Cream Silk',
    description: 'Watsons PH conditioner for dry and damaged-looking hair.',
    price: 199,
    categories: ['moisturizing'],
  },
  {
    name: 'Hairfall Defense Conditioner',
    brand: 'Dove',
    description: 'Watsons PH conditioner for breakage-prone and weak hair strands.',
    price: 229,
    categories: ['moisturizing'],
  },
  {
    name: 'Keratin Smooth Conditioner',
    brand: 'TRESemmé',
    description: 'Watsons PH smoothing conditioner for frizz-prone hair.',
    price: 289,
    categories: ['anti-frizz', 'moisturizing'],
  },

  // Hair Serum / Oil (3)
  {
    name: 'Cuticle Coat Serum',
    brand: 'Vitress',
    description: 'Watsons PH serum for shine, anti-frizz, and smoother finish.',
    price: 129,
    categories: ['anti-frizz'],
  },
  {
    name: 'Keratin 10-in-1 Hair Elixir',
    brand: 'Luxe Organix',
    description: 'Watsons PH leave-on elixir for anti-frizz and smoothness support.',
    price: 349,
    categories: ['anti-frizz'],
  },
  {
    name: 'Perfect Repair Serum',
    brand: 'Mise-en-scene',
    description: 'Watsons PH repair serum for smoother lengths and reduced frizz look.',
    price: 599,
    categories: ['anti-frizz', 'moisturizing'],
  },

  // Hair Mask / Treatment (3)
  {
    name: 'Keratin Treatment Hair Mask',
    brand: 'Luxe Organix',
    description: 'Watsons PH keratin treatment mask for dry and frizz-prone hair.',
    price: 399,
    categories: ['moisturizing', 'anti-frizz'],
  },
  {
    name: 'Keratin Smooth Treatment Mask',
    brand: 'TRESemmé',
    description: 'Watsons PH smoothing treatment mask for rough and frizz-prone lengths.',
    price: 379,
    categories: ['moisturizing', 'anti-frizz'],
  },
  {
    name: 'Premium Touch Hair Mask',
    brand: 'Fino',
    description: 'Watsons PH rich conditioning mask for dry-looking and rough hair.',
    price: 699,
    categories: ['moisturizing', 'anti-frizz'],
  },
];

const PH_PRODUCTS = [...USER_CURATED_LOCAL_PH_PRODUCTS];

const PRODUCT_IMAGE_OVERRIDES = {
  // Shampoo (3)
  'Head & Shoulders::Cool Menthol Anti-Dandruff Shampoo':
    'https://medias.watsons.com.ph/publishing/H%26S_Image1_10091511-jLYyxRaL-zoom.png?version=1763258338',
  'Dove::Intense Repair Shampoo':
    'https://medias.watsons.com.ph/publishing/WTCPH-50055811-front-zoom.jpg?version=1762541407',
  'TRESemmé::Keratin Smooth Shampoo':
    'https://medias.watsons.com.ph/publishing/WTCPH-10097965-front-zoom.jpg?version=1734001427',

  // Conditioner (3)
  'Cream Silk::Triple Keratin Rescue Ultimate Repair Conditioner':
    'https://medias.watsons.com.ph/publishing/WTCPH-50020843-front-zoom.jpg?version=1734084128',
  'Dove::Hairfall Defense Conditioner':
    'https://medias.watsons.com.ph/publishing/1-gMPZJLae-zoom.jpg?version=1758702040',
  'TRESemmé::Keratin Smooth Conditioner':
    'https://medias.watsons.com.ph/publishing/WTCPH-10097969-front-zoom.jpg?version=1734044690',

  // Serum / Oil (3)
  'Vitress::Cuticle Coat Serum':
    'https://medias.watsons.com.ph/publishing/50028690-lUDnp5ON-X0aLMc9l-zoom.png?version=1775577641',
  'Luxe Organix::Keratin 10-in-1 Hair Elixir':
    'https://medias.watsons.com.ph/publishing/LOKeratinHairElixir_50003381_%20%281%29-dMOcRupV-zoom.jpg?version=1746694409',
  'Mise-en-scene::Perfect Repair Serum':
    'https://medias.watsons.com.ph/publishing/50040255-SBSImqWI-zoom.png?version=1762676996',

  // Hair Mask / Treatment (3)
  'Luxe Organix::Keratin Treatment Hair Mask':
    'https://medias.watsons.com.ph/publishing/LO_PremiumKeratintreatmentAloeVera_50019775%20%20%281%29-wkra9j9E-zoom.jpg?version=1746695153',
  'TRESemmé::Keratin Smooth Treatment Mask':
    'https://medias.watsons.com.ph/publishing/WTCPH-50054912-front-zoom.jpg?version=1763052610',
  'Fino::Premium Touch Hair Mask':
    'https://medias.watsons.com.ph/publishing/FINO_IMAGE%201_50052641-C2N2qZXG-CeA6PWiB-zoom.png?version=1775577609',
};

function resolveImageUrl(product) {
  const key = `${String(product.brand || '').trim()}::${String(product.name || '').trim()}`;
  if (PRODUCT_IMAGE_OVERRIDES[key]) return PRODUCT_IMAGE_OVERRIDES[key];
  const explicit = String(product.imageUrl || '').trim();
  if (explicit && /^https?:\/\//i.test(explicit) && !explicit.includes('_PH.jpg')) return explicit;
  // No synthetic placeholders: return null when there is no verified external image.
  return null;
}

async function ensureProduct(conn, product) {
  const [rows] = await conn.query(
    'SELECT product_id FROM products WHERE name = ? AND IFNULL(brand, "") = IFNULL(?, "") LIMIT 1',
    [product.name, product.brand]
  );

  if (rows.length > 0) {
    const productId = rows[0].product_id;
    const imageUrl = resolveImageUrl(product);
    await conn.query(
      `UPDATE products
       SET description = ?, price = ?, image_url = ?, expiry_type = 'not_applicable', expiry_date = NULL, expiry_period_months = NULL
       WHERE product_id = ?`,
      [product.description, product.price, imageUrl, productId]
    );
    return { productId, action: 'updated' };
  }

  const imageUrl = resolveImageUrl(product);
  const [inserted] = await conn.query(
    `INSERT INTO products (name, brand, description, price, image_url, expiry_type, expiry_date, expiry_period_months)
     VALUES (?, ?, ?, ?, ?, 'not_applicable', NULL, NULL)`,
    [product.name, product.brand, product.description, product.price, imageUrl]
  );
  return { productId: inserted.insertId, action: 'inserted' };
}

async function syncCategories(conn, productId, categories) {
  await conn.query('DELETE FROM product_categories WHERE product_id = ?', [productId]);
  for (const categoryName of categories) {
    await conn.query(
      'INSERT INTO product_categories (product_id, category_name) VALUES (?, ?)',
      [productId, categoryName]
    );
  }
}

async function run() {
  const conn = await mysql.createConnection(mysqlOpts);
  let inserted = 0;
  let updated = 0;
  try {
    await conn.query(`USE \`${database}\``);
    for (const product of PH_PRODUCTS) {
      const result = await ensureProduct(conn, product);
      if (result.action === 'inserted') inserted += 1;
      if (result.action === 'updated') updated += 1;
      await syncCategories(conn, result.productId, product.categories);
    }

    // Prune older catalog rows: keep only the curated list above.
    if (PH_PRODUCTS.length) {
      const pairSql = PH_PRODUCTS.map(() => '(?, ?)').join(', ');
      const pairVals = PH_PRODUCTS.flatMap((p) => [p.name, p.brand || '']);

      try {
        await conn.query(
          `DELETE FROM recommendations
           WHERE product_id IN (
             SELECT p.product_id
             FROM products p
             WHERE (p.name, IFNULL(p.brand, '')) NOT IN (${pairSql})
           )`,
          pairVals
        );
      } catch (_e) {
        // recommendations table may be absent in some setups; ignore prune for that table.
      }

      await conn.query(
        `DELETE FROM product_categories
         WHERE product_id IN (
           SELECT p.product_id
           FROM products p
           WHERE (p.name, IFNULL(p.brand, '')) NOT IN (${pairSql})
         )`,
        pairVals
      );

      await conn.query(
        `DELETE FROM products
         WHERE (name, IFNULL(brand, '')) NOT IN (${pairSql})`,
        pairVals
      );
    }

    const [productCountRows] = await conn.query('SELECT COUNT(*) AS c FROM products');
    const [categoryCountRows] = await conn.query('SELECT COUNT(*) AS c FROM product_categories');
    console.log(`Curated PH product sync complete. inserted=${inserted}, updated=${updated}`);
    console.log(`curated_products_kept=${PH_PRODUCTS.length}`);
    console.log(`products=${productCountRows[0].c}, product_categories=${categoryCountRows[0].c}`);
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('PH product sync failed:', err.message || err);
  process.exit(1);
});

