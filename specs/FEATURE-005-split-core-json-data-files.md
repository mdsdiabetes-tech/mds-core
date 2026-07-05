# FEATURE-005: Split Core JSON Data Files

## Status

Complete

## Business Objective

Make MDS Core data easier to maintain by splitting the monolithic `data/core.json` into separate collection files while keeping backward compatibility with the legacy core file.

## Technical Summary

Added one JSON file per top-level collection under `data/`. Updated the data loader to prefer split collection files and fall back to `data/core.json` when split files are unavailable. Updated validation to use the shared collection list from the loader.

## Files Changed

- `src/dataStore.ts`
- `scripts/validate.ts`
- `data/products.json`
- `data/brands.json`
- `data/manufacturers.json`
- `data/medications.json`
- `data/devices.json`
- `data/diseases.json`
- `data/categories.json`
- `data/faqs.json`
- `data/articles.json`
- `data/reviews.json`
- `data/relationships.json`

## Acceptance Criteria

- Each collection exists as a separate JSON array file.
- Runtime loading prefers split files.
- `data/core.json` remains a reasonable fallback.
- Validation reads the same collection set as the runtime loader.
- Existing API response shapes and routes remain unchanged.

## Validation Status

Complete. `npm run build` and `npm run validate` passed after implementation. Product, page, recommend, and graph routes were spot-checked using split data files.

