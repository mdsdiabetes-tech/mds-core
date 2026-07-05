import { CoreData, Product, RelationshipType } from './types.js';

function relatedIds(data: CoreData, productId: string, type: RelationshipType, fallbackIds?: string[]) {
  const ids = data.relationships
    .filter(r => r.sourceType === 'Product' && r.sourceId === productId && r.type === type)
    .map(r => r.targetId);

  return ids.length > 0 ? ids : fallbackIds ?? [];
}

export function getProductBundle(data: CoreData, slug: string) {
  const product = data.products.find(p => p.slug === slug || p.sku === slug);
  if (!product) return null;
  const byIds = <T extends {id:string}>(items:T[], ids?:string[]) => items.filter(i => ids?.includes(i.id));
  const relationshipIds = (type: RelationshipType, fallbackIds?: string[]) => relatedIds(data, product.id, type, fallbackIds);
  return {
    product,
    brand: byIds(data.brands, relationshipIds('belongs_to_brand', product.brandId ? [product.brandId] : []))[0],
    manufacturer: byIds(data.manufacturers, relationshipIds('made_by_manufacturer', product.manufacturerId ? [product.manufacturerId] : []))[0],
    categories: byIds(data.categories, relationshipIds('belongs_to_category', product.categoryIds)),
    compatibleDevices: byIds(data.devices, relationshipIds('compatible_with_device', product.compatibleDeviceIds)),
    compatibleMedications: byIds(data.medications, relationshipIds('compatible_with_medication', product.compatibleMedicationIds)),
    relatedProducts: byIds(data.products, relationshipIds('related_product', product.relatedProductIds)),
    alternatives: byIds(data.products, relationshipIds('alternative_product', product.alternativeProductIds)),
    faqs: byIds(data.faqs, relationshipIds('has_faq', product.faqIds)),
    articles: byIds(data.articles, relationshipIds('has_article', product.articleIds)),
    reviews: byIds(data.reviews, relationshipIds('has_review', product.reviewIds)),
  };
}
export function recommendProducts(data: CoreData, query: {device?:string; medication?:string; travel?:boolean; diabetesType?:string; category?:string}) {
  const hasRelationship = (product: Product, type: RelationshipType, targetId?: string, fallbackIds?: string[]) => {
    if (!targetId) return true;
    return relatedIds(data, product.id, type, fallbackIds).includes(targetId);
  };

  return data.products
    .filter((p: Product) => !query.travel || p.travelFriendly)
    .filter(p => hasRelationship(p, 'recommended_for_disease', query.diabetesType, p.diabetesTypes))
    .filter(p => hasRelationship(p, 'belongs_to_category', query.category, p.categoryIds))
    .filter(p => hasRelationship(p, 'compatible_with_device', query.device, p.compatibleDeviceIds))
    .filter(p => hasRelationship(p, 'compatible_with_medication', query.medication, p.compatibleMedicationIds))
    .slice(0, 20);
}
