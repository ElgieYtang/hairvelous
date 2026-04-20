# Recommendation Engine API

## Overview

The rule-based recommendation engine generates personalized product recommendations, routine plans, warnings, and DIY guide suggestions based on user hair profile and preferences.

## Endpoints

### 1. Generate Recommendations from User Profile
**GET/POST** `/api/recommendations/profile`

Requires authentication. Uses the logged-in user's hair profile from the database.

**Query Parameters (GET) or Body (POST):**
```json
{
  "budget": "low|medium|high",
  "productType": "shampoo|conditioner|serum|mask|all"
}
```

**Response:**
```json
{
  "recommendations": [...],
  "routinePlan": {...},
  "warnings": [...],
  "diyGuides": [...],
  "disclaimer": "..."
}
```

### 2. Generate Recommendations from Direct Input
**POST** `/api/recommendations/generate`

Does not require authentication. Accepts profile data directly (useful for testing/demo).

**Body:**
```json
{
  "hairType": "straight|wavy|curly|coily",
  "scalpCondition": "oily|dry|normal|sensitive",
  "issues": ["dryness", "frizz", "flaking", "oiliness"],
  "preferences": {
    "budget": "low|medium|high",
    "productType": "shampoo|conditioner|serum|mask|all"
  }
}
```

**Response:** Same as above.

### 3. Get User's Saved Recommendations
**GET** `/api/recommendations/saved`

Requires authentication. Returns previously saved recommendations for the user.

## Input Parameters

### Hair Type
- `straight` - Fine to medium texture
- `wavy` - 2A-2C waves
- `curly` - 3A-3C curls
- `coily` - 4A-4C coils

### Scalp Condition
- `oily` - Excess sebum production
- `dry` - Lacks natural oils
- `normal` - Balanced
- `sensitive` - Prone to irritation

### Issues (array)
- `dryness` - Hair lacks moisture
- `frizz` - Unruly hair
- `flaking` - Scalp flakes (non-medical)
- `oiliness` - Excess scalp oil
- `thinning` - Hair loss concerns (non-medical advice only)

### Preferences
- **budget**: `low` (< $15), `medium` ($15-$25), `high` (> $25)
- **productType**: `shampoo`, `conditioner`, `serum`, `mask`, `all`

## Output Structure

### Recommendations Array
Each recommendation includes:
- `productId` - Product ID
- `name` - Product name
- `brand` - Brand name
- `description` - Product description
- `price` - Price (decimal)
- `reason` - Why this product was recommended
- `matchScore` - Scoring value (1-15+)

### Routine Plan
- `daily` - Array of daily steps with time, step, product, note
- `weekly` - Array of weekly steps with frequency, products, note
- `notes` - General routine notes

### Warnings
Array of warning strings including:
- Patch test instructions
- Irritation warnings
- Professional consultation advice
- Issue-specific warnings

### DIY Guides
Array of matching DIY guides with:
- `guideId` - Guide ID
- `title` - Guide title
- `summary` - Guide summary

## Example Requests

### Example 1: Curly hair, dry scalp, dryness + frizz
```bash
POST /api/recommendations/generate
Content-Type: application/json

{
  "hairType": "curly",
  "scalpCondition": "dry",
  "issues": ["dryness", "frizz"],
  "preferences": {
    "budget": "medium",
    "productType": "all"
  }
}
```

### Example 2: Straight hair, oily scalp, oiliness + flaking
```bash
POST /api/recommendations/generate
Content-Type: application/json

{
  "hairType": "straight",
  "scalpCondition": "oily",
  "issues": ["oiliness", "flaking"],
  "preferences": {
    "budget": "low",
    "productType": "shampoo"
  }
}
```

### Example 3: Thinning concern (non-medical advice)
```bash
POST /api/recommendations/generate
Content-Type: application/json

{
  "hairType": "wavy",
  "scalpCondition": "normal",
  "issues": ["thinning"],
  "preferences": {
    "budget": "medium",
    "productType": "all"
  }
}
```

See `RECOMMENDATION_EXAMPLES.json` for full example responses.
