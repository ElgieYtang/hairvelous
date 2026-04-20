# DIY Guides Table Update

## Schema Changes

### New Table Structure
The `diy_guides` table now includes:
- `guide_id` (PK, AUTO_INCREMENT)
- `title` (VARCHAR(255), NOT NULL)
- `category` (ENUM: 'mask', 'oil', 'rinse', 'growth', DEFAULT 'mask')
- `difficulty` (ENUM: 'easy', 'medium', 'hard', DEFAULT 'easy')
- `ingredients` (TEXT, NULL)
- `steps` (TEXT, NOT NULL)
- `caution` (TEXT, NULL)
- `created_by` (INT, FK to users.user_id, NULL)
- `date_created` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### Indexes
- `idx_category` - For filtering by category
- `idx_difficulty` - For filtering by difficulty
- `idx_created_by` - For admin tracking
- `idx_date_created` - For sorting

## Migration

**File:** `database/migration_add_diy_guides_fields.sql`

Run this if you already have the old `diy_guides` table:
```bash
mysql -u root -p hairvelous < database/migration_add_diy_guides_fields.sql
```

Or use the updated `schema_hairvelous.sql` for fresh installs.

## API Routes

### Public Routes
- `GET /api/guides` - List all guides (optional filters: `?category=mask&difficulty=easy`)
- `GET /api/guides/:guideId` - Get single guide with full details

### Admin Routes
- `POST /api/guides` - Create new guide (requires admin auth)
- `PUT /api/guides/:guideId` - Update guide (requires admin auth)
- `PATCH /api/guides/:guideId` - Update guide (alternative, requires admin auth)
- `DELETE /api/guides/:guideId` - Delete guide (requires admin auth)

## Frontend Updates

### Public Guides Page (`guides.html`)
- Filter dropdowns for category and difficulty
- Guide cards showing title, category badge, difficulty badge
- Detail view with ingredients, steps, and caution sections
- Click card to view full guide

### Admin Guide Management (`guide_management.html`)
- Form fields: title, category, difficulty, ingredients, steps, caution
- Create/Edit/Delete functionality
- List view shows category and difficulty badges

## Sample Data

5 sample guides included:
1. Coconut Oil Hair Mask (mask, easy)
2. Apple Cider Vinegar Rinse (rinse, easy)
3. Argan Oil Treatment (oil, easy)
4. Egg and Olive Oil Mask (mask, medium)
5. Rice Water Rinse for Growth (rinse, easy)

## Validation

- Category must be: mask, oil, rinse, or growth
- Difficulty must be: easy, medium, or hard
- Title and steps are required
- Ingredients and caution are optional
