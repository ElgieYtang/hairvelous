const pool = require('../config/db');

const INPUT_PRODUCTS = [
  {
    name: 'Luxe Organix Premium Keratin Argan Shampoo',
    brand: 'Luxe Organix',
    imageUrl:
      'https://medias.watsons.com.ph/publishing/Lo_KeratinShampooArgan_50018336%20%282%29-LuWz2fo8-zoom.jpg?version=1746692611',
  },
  {
    name: 'Sunsilk Smooth & Manageable Shampoo',
    brand: 'Sunsilk',
    imageUrl: 'https://medias.watsons.com.ph/publishing/WTCPH-10063275-front-zoom.jpg?version=1733990748',
  },
  {
    name: 'Herbal Essences Argan Oil Shampoo',
    brand: 'Herbal Essences',
    imageUrl:
      'https://medias.watsons.com.ph/publishing/HE_Image2_50037080-aKDEPjW2-zoom.png?version=1763275650',
  },
  {
    name: 'Monea Curl Defining Milk',
    brand: 'Monea',
    imageUrl: 'https://medias.watsons.com.ph/publishing/Monea_Image1_10072879-jqTw97wx-zoom.png?version=1762574219',
  },
  {
    name: 'Ouai Thick Hair Conditioner',
    brand: 'Ouai',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQNe6N0MHcBhE-ELi-dG5utyGUqLbN81DwM7BHGQiOFCekHl-RBSONy7s2bagPlWwoVoGwyRvxitK1xuByoYCjMLpfnpYh6jg68Bv7IhBf8doyv0TbQ4Fd2MPY',
  },
  {
    name: 'Olaplex No.5 Bond Maintenance Conditioner',
    brand: 'Olaplex',
    imageUrl:
      'https://www.thehaircaregroup.com/hair-care/conditioner/colour-conditioner/olaplex-no5-bond-maintenance-conditioner-1l-62176/',
  },
  {
    name: 'Herbal Essences Coconut Milk Shampoo',
    brand: 'Herbal Essences',
    imageUrl:
      'https://medias.watsons.com.ph/publishing/HE_Image2_50009192-R9SKaPjJ-zoom.png?version=1763276591',
  },
  {
    name: 'Head & Shoulders Smooth & Silky',
    brand: 'Head & Shoulders',
    imageUrl:
      'https://medias.watsons.com.ph/publishing/H%26S_Image2_50047940-CDB0A9of-zoom.png?version=1763198286',
  },
  {
    name: 'Palmolive Cool & Fresh Shampoo',
    brand: 'Palmolive',
    imageUrl: 'https://medias.watsons.com.ph/publishing/WTCPH-50047949-front-zoom.jpg?version=1734353516',
  },
  {
    name: 'Human Nature Rosemary Shampoo',
    brand: 'Human Nature',
    imageUrl:
      'https://medias.watsons.com.ph/publishing/HumanNature_Image2_Watsons50025441-GcbshrHC-zoom.jpg?version=1765448964',
  },
  {
    name: "L'Oréal Ever Pure Moisture Shampoo",
    brand: "L'Oréal",
    imageUrl:
      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/loe/loe34124/l/50.jpg',
  },
  {
    name: 'Moringa-O2 Anti-Frizz Shampoo',
    brand: 'Moringa-O2',
    imageUrl:
      'https://medias.watsons.com.ph/publishing/MORINGA-IMAGE1_50020704-0N5Y6AOM-zoom.jpg?version=1765350086',
  },
  {
    name: 'Palmolive Intensive Moisture Shampoo',
    brand: 'Palmolive',
    imageUrl:
      'https://medias.watsons.com.ph/publishing/Palmolive_Image2_10069754-bA3hqQZo-zoom.jpg?version=1757654765',
  },
  {
    name: 'Demiki Clarifying Shampoo',
    brand: 'Demiki',
    imageUrl: 'https://m.media-amazon.com/images/I/71+VLfn+HrL._SL1500_.jpg',
  },
  {
    name: 'Olaplex No.4 Bond Maintenance Shampoo',
    brand: 'Olaplex',
    imageUrl:
      'https://www.hairmnl.com/cdn/shop/files/OlaplexNo.4CBondMaintenanceClarifyingShampoo250mlAllureBestofBeauty.jpg?v=1690495928',
  },
  {
    name: 'Dove Intense Repair Shampoo',
    brand: 'Dove',
    imageUrl: 'https://medias.watsons.com.ph/publishing/2%2010090104-XDHkn3Gy-zoom.jpg?version=1759460155',
  },
  {
    name: 'Pantene Hair Fall Control Shampoo',
    brand: 'Pantene',
    imageUrl:
      'https://medias.watsons.com.ph/publishing/PTN_Image2_10090242-fTxuxzEz-zoom.png?version=1763281422',
  },
  {
    name: 'Moringa-O2 Anti Hairfall Shampoo',
    brand: 'Moringa-O2',
    imageUrl: 'https://medias.watsons.com.ph/publishing/WTCPH-10097544-front-zoom.jpg?version=1734056881',
  },
  {
    name: 'Moringa-O2 Anti Hairfall Conditioner',
    brand: 'Moringa-O2',
    imageUrl: 'https://medias.watsons.com.ph/publishing/WTCPH-10101108-front-zoom.jpg?version=1734056833',
  },
  {
    name: 'Luxe Organix Keratin Shampoo',
    brand: 'Luxe Organix',
    imageUrl:
      'https://medias.watsons.com.ph/publishing/Lo_KeratinShampooMilk%20Protein_50041084%20%282%29-OpBbcxB6-zoom.jpg?version=1746693386',
  },
  {
    name: 'Tresemmé Keratin Shampoo',
    brand: 'Tresemmé',
    imageUrl: 'https://medias.watsons.com.ph/publishing/WTCPH-10097965-side-zoom.jpg?version=1720776176',
  },
  {
    name: 'Kérastase Genesis Shampoo',
    brand: 'Kérastase',
    imageUrl: 'https://d3pllp7nz3wmw5.cloudfront.net/product_images/25348100444_XL.jpg',
  },
];

function inferCategories(name) {
  const n = String(name || '').toLowerCase();
  const categories = new Set();
  if (n.includes('anti-dandruff') || n.includes('head & shoulders')) categories.add('anti-dandruff');
  if (n.includes('anti-frizz') || n.includes('smooth') || n.includes('keratin')) categories.add('anti-frizz');
  if (n.includes('clarifying') || n.includes('cool & fresh')) categories.add('clarifying/oily scalp');
  if (n.includes('moisture') || n.includes('milk') || n.includes('repair') || n.includes('conditioner')) {
    categories.add('moisturizing');
  }
  if (!categories.size) categories.add('moisturizing');
  return Array.from(categories);
}

function buildDescription(name) {
  const n = String(name || '').toLowerCase();
  const parts = [];
  if (n.includes('shampoo')) parts.push('Gently cleanses scalp and hair for daily cosmetic care.');
  if (n.includes('conditioner')) parts.push('Helps soften strands and improve manageability after washing.');
  if (n.includes('anti-frizz') || n.includes('smooth') || n.includes('keratin')) {
    parts.push('Best suited for frizz control and smoother-looking hair.');
  }
  if (n.includes('clarifying')) parts.push('Designed to remove buildup and refresh oily-feeling scalp.');
  if (n.includes('hair fall') || n.includes('hairfall') || n.includes('genesis')) {
    parts.push('Targeted for breakage-prone hair and hair fall concerns (cosmetic support).');
  }
  if (n.includes('moisture') || n.includes('milk')) parts.push('Supports moisture retention for dry-feeling hair.');
  parts.push('For external use only. Patch-test if you have a sensitive scalp.');
  return parts.join(' ');
}

async function ensureProductColumns() {
  const tryAlter = async (sql) => {
    try {
      await pool.query(sql);
    } catch (err) {
      if (err && (err.code === 'ER_DUP_FIELDNAME' || err.errno === 1060)) return;
      throw err;
    }
  };
  await tryAlter('ALTER TABLE products ADD COLUMN image_url VARCHAR(500) NULL');
}

async function ensureProductCategoriesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_categories (
      category_id INT PRIMARY KEY AUTO_INCREMENT,
      product_id INT NOT NULL,
      category_name VARCHAR(120) NOT NULL,
      INDEX idx_product_id (product_id),
      INDEX idx_category_name (category_name),
      CONSTRAINT fk_product_category_product
        FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB
  `);
}

async function ensureCategoryRow(productId, categoryName) {
  const [rows] = await pool.query(
    'SELECT category_id FROM product_categories WHERE product_id = ? AND category_name = ?',
    [productId, categoryName]
  );
  if (rows.length) return false;
  await pool.query('INSERT INTO product_categories (product_id, category_name) VALUES (?, ?)', [
    productId,
    categoryName,
  ]);
  return true;
}

async function upsertProduct(product) {
  const description = buildDescription(product.name);
  const categories = inferCategories(product.name);

  const [existing] = await pool.query(
    'SELECT product_id FROM products WHERE name = ? AND brand = ? LIMIT 1',
    [product.name, product.brand]
  );

  let productId;
  let inserted = false;

  if (existing.length) {
    productId = existing[0].product_id;
    await pool.query(
      `UPDATE products
       SET description = ?, image_url = ?, expiry_type = 'not_applicable', expiry_date = NULL, expiry_period_months = NULL
       WHERE product_id = ?`,
      [description, product.imageUrl, productId]
    );
  } else {
    const [ins] = await pool.query(
      `INSERT INTO products
       (name, brand, description, image_url, price, expiry_type, expiry_date, expiry_period_months)
       VALUES (?, ?, ?, ?, 0, 'not_applicable', NULL, NULL)`,
      [product.name, product.brand, description, product.imageUrl]
    );
    productId = ins.insertId;
    inserted = true;
  }

  let addedCategories = 0;
  for (const c of categories) {
    const added = await ensureCategoryRow(productId, c);
    if (added) addedCategories += 1;
  }

  return { inserted, updated: !inserted, addedCategories };
}

async function run() {
  await ensureProductColumns();
  await ensureProductCategoriesTable();

  const seen = new Set();
  const uniqueList = INPUT_PRODUCTS.filter((p) => {
    const key = `${String(p.brand).toLowerCase()}::${String(p.name).toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  let inserted = 0;
  let updated = 0;
  let categoriesAdded = 0;
  for (const item of uniqueList) {
    const r = await upsertProduct(item);
    if (r.inserted) inserted += 1;
    if (r.updated) updated += 1;
    categoriesAdded += r.addedCategories;
  }

  const [[{ pCount }]] = await pool.query('SELECT COUNT(*) AS pCount FROM products');
  const [[{ cCount }]] = await pool.query('SELECT COUNT(*) AS cCount FROM product_categories');
  console.log(
    `Custom import complete. inserted=${inserted}, updated=${updated}, categories_added=${categoriesAdded}, products_total=${pCount}, categories_total=${cCount}`
  );
}

run()
  .catch((err) => {
    console.error('Import failed:', err.message || err);
    process.exit(1);
  })
  .finally(() => pool.end());
