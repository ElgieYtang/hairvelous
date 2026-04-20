# Hairvelous Recommendation Engine - Rules

## Overview
Rule-based product recommendation system that matches user profile (hair type, scalp condition, issues) and preferences (budget, product type) to products from the database.

## Input Parameters

### Hair Type
- `straight` - Fine to medium texture, tends to be oily
- `wavy` - 2A-2C waves, combination texture
- `curly` - 3A-3C curls, needs moisture
- `coily` - 4A-4C coils, requires heavy moisture

### Scalp Condition
- `oily` - Produces excess sebum, needs clarifying
- `dry` - Lacks natural oils, needs hydration
- `normal` - Balanced, minimal intervention
- `sensitive` - Prone to irritation, needs gentle products

### Issues (can be multiple)
- `dryness` - Hair lacks moisture
- `frizz` - Unruly, needs smoothing
- `flaking` - Scalp flakes (non-medical, preventive only)
- `oiliness` - Excess scalp oil
- `thinning` - Hair loss concerns (non-medical advice only)

### User Preferences
- **Budget**: `low` (< $15), `medium` ($15-$25), `high` (> $25)
- **Product Type**: `shampoo`, `conditioner`, `serum`, `mask`, `all`

## Matching Rules

### 1. Issue-Based Category Matching

| Issue | Primary Category | Secondary Category |
|-------|-----------------|-------------------|
| dryness | moisturizing | - |
| frizz | anti-frizz | moisturizing |
| flaking | anti-dandruff | - |
| oiliness | clarifying/oily scalp | - |
| thinning | (no category match - advice only) | - |

### 2. Hair Type Adjustments

- **Straight + Oily Scalp**: Prioritize clarifying products, lightweight formulas
- **Curly/Coily + Dry Scalp**: Prioritize moisturizing, avoid clarifying
- **Wavy**: Balanced approach, can use most categories
- **Sensitive Scalp**: Filter out harsh clarifying products, prefer gentle formulas

### 3. Product Type Priority

Based on user preference, prioritize matching product types. If "all", include mix:
- Shampoo: 2-3 products
- Conditioner: 2-3 products
- Serum: 1-2 products
- Mask: 1-2 products

### 4. Budget Filtering

- Filter products by price range based on budget preference
- If no products match budget, show closest matches with note

### 5. Thinning Issue Handling

- **No product recommendations** (non-medical)
- **Advice only**: "Consult a healthcare professional for hair loss concerns"
- **Routine suggestions**: Gentle handling, avoid harsh chemicals

## Recommendation Scoring

Each product gets a score (1-10) based on:
- **Category match**: +5 if primary category matches issue
- **Category match**: +3 if secondary category matches
- **Hair type compatibility**: +1 to +2
- **Scalp condition compatibility**: +1 to +2
- **Product type preference**: +1 if matches user preference

Top 5-10 products by score are returned.

## Routine Plan Generation

### Daily Routine
- **Morning**: Light product (serum or leave-in)
- **Evening**: Cleansing (if needed)

### Weekly Routine
- **Wash frequency**: Based on scalp condition
  - Oily: 3-4x/week
  - Dry: 1-2x/week
  - Normal: 2-3x/week
- **Deep treatment**: 1x/week (mask)
- **Clarifying**: 1x/month (if oily scalp)

## Warnings & Disclaimers

Always include:
1. **Patch Test**: "Always patch test new products on a small area first"
2. **Irritation**: "Stop use immediately if irritation occurs"
3. **Severe Symptoms**: "Consult a healthcare professional for severe or persistent concerns"
4. **Non-Medical**: "This is preventive awareness only, not medical diagnosis or treatment"

## DIY Guide Matching

Match DIY guides by tags/issues:
- `dryness` → Moisturizing DIY guides
- `frizz` → Smoothing DIY guides
- `flaking` → Scalp care DIY guides
- `oiliness` → Clarifying DIY guides
