# FEATURE-004: Standardize Graph API Routes

## Status

Complete

## Business Objective

Provide standardized `/api/graph/...` routes for consumers while preserving the earlier `/graph/...` routes for backward compatibility.

## Technical Summary

Added `/api/graph/...` route aliases and standard graph route helpers. Added lower-case and plural node type aliases so clients can request routes such as `products` and `problems` without using internal TypeScript enum casing. Shared the product graph handler between old and standardized routes to keep behavior identical.

## Files Changed

- `src/server.ts`
- `src/graphEngine.ts`

## Acceptance Criteria

- Standardized `/api/graph` route returns graph output.
- Standardized node routes support lower-case plural node names.
- `GET /api/graph/products/:slug` returns the same response as `GET /graph/products/:slug`.
- Existing `/graph/...` routes continue to work.
- Existing product, page, and recommendation routes are unchanged.

## Validation Status

Complete. `npm run build` and `npm run validate` passed after implementation. Route checks confirmed old and new product graph routes returned matching product graph responses.

