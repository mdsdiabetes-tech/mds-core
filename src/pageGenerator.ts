import { CoreData } from './types.js';
import { getProductBundle } from './relationshipEngine.js';
export function productPagePayload(data: CoreData, slug: string) {
  const bundle = getProductBundle(data, slug);
  if (!bundle) return null;
  const { product, brand, categories, compatibleDevices, compatibleMedications, relatedProducts, alternatives, faqs, articles, reviews } = bundle;
  return {
    seo: { title: `${product.name} | MDS Diabetes`, description: product.aiSummary || `Shop ${product.name} at MDS Diabetes.`, keywords: product.seoKeywords || [] },
    hero: { name: product.name, brand: brand?.name, summary: product.aiSummary, images: product.images || [] },
    sections: { categories, compatibleDevices, compatibleMedications, relatedProducts, alternatives, faqs, articles, reviews },
    schema: productJsonLd(bundle),
  };
}
function productJsonLd(bundle: any) {
  const p = bundle.product;
  return { '@context':'https://schema.org', '@type':'Product', name:p.name, sku:p.sku, brand: bundle.brand?.name, description:p.aiSummary, image:p.images };
}
