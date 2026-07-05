# MDS Core — Codex Build Spec

## Mission
Build the reusable knowledge engine behind MDS Diabetes: products, diseases, medications, devices, FAQs, comparisons, recommendations, SEO payloads, and future AI answers.

## First milestone
Run this repo locally, confirm `/health`, `/products/:slug`, `/pages/product/:slug`, and `/recommend` work.

## Next Codex tasks
1. Add persistent database support: Supabase/Postgres preferred.
2. Convert JSON types into relational tables.
3. Build admin CRUD screens for products, brands, medications, devices, FAQs.
4. Add import/export CSV for Wix product data.
5. Add JSON-LD schema generation for Product, FAQPage, Article, BreadcrumbList.
6. Add comparison endpoint: `/compare?products=slug1,slug2`.
7. Add product finder wizard endpoint.
8. Add API endpoint Wix can call from Velo.

## Acceptance criteria
- No duplicated business logic inside Wix pages.
- Wix consumes MDS Core via API.
- Product page payload includes SEO, schema, FAQs, related products, alternatives, compatibility, articles, and reviews.
- All medical advice content must include sources and avoid unsupported claims.
