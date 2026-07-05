export type ID = string;
export type NodeType =
  | 'Product'
  | 'Brand'
  | 'Manufacturer'
  | 'Category'
  | 'Disease'
  | 'Medication'
  | 'Device'
  | 'Article'
  | 'FAQ'
  | 'Video'
  | 'Review'
  | 'Bundle';
export type RelationshipType =
  | 'belongs_to_brand'
  | 'made_by_manufacturer'
  | 'belongs_to_category'
  | 'compatible_with_device'
  | 'compatible_with_medication'
  | 'recommended_for_disease'
  | 'related_product'
  | 'alternative_product'
  | 'has_faq'
  | 'has_article'
  | 'has_video'
  | 'has_review'
  | 'included_in_bundle';
export type Relationship = {
  id: ID;
  sourceType: NodeType;
  sourceId: ID;
  type: RelationshipType;
  targetType: NodeType;
  targetId: ID;
};
export type Product = {
  id: ID; sku: string; name: string; slug: string;
  brandId?: ID; manufacturerId?: ID; categoryIds: ID[];
  diabetesTypes?: string[]; compatibleDeviceIds?: ID[]; compatibleMedicationIds?: ID[];
  relatedProductIds?: ID[]; alternativeProductIds?: ID[];
  prescriptionRequired?: boolean; otc?: boolean; travelFriendly?: boolean;
  temperatureRequirements?: string; storageRequirements?: string;
  insuranceEligible?: boolean; fdaStatus?: string;
  images?: string[]; videos?: ID[]; downloads?: string[];
  faqIds?: ID[]; articleIds?: ID[]; reviewIds?: ID[];
  commonProblems?: string[]; solutions?: string[]; warranty?: string;
  shippingRestrictions?: string[]; countries?: string[]; seoKeywords?: string[];
  aiSummary?: string; lastUpdated: string;
};
export type Brand = { id: ID; name: string; slug: string; description?: string; website?: string; supportUrl?: string; };
export type Manufacturer = Brand;
export type Medication = { id: ID; name: string; slug: string; type?: string; storage?: string; temperature?: string; relatedProductIds?: ID[]; faqIds?: ID[]; };
export type Device = { id: ID; name: string; slug: string; brandId?: ID; deviceType: string; compatibleProductIds?: ID[]; faqIds?: ID[]; };
export type Disease = { id: ID; name: string; slug: string; description?: string; recommendedCategoryIds?: ID[]; faqIds?: ID[]; };
export type Category = { id: ID; name: string; slug: string; parentId?: ID; description?: string; };
export type FAQ = { id: ID; question: string; answer: string; relatedProductIds?: ID[]; relatedDeviceIds?: ID[]; relatedMedicationIds?: ID[]; sourceUrls?: string[]; lastReviewed: string; };
export type Article = { id: ID; title: string; slug: string; summary: string; body: string; relatedProductIds?: ID[]; relatedFAQIds?: ID[]; seoKeywords?: string[]; lastUpdated: string; };
export type Review = { id: ID; productId: ID; rating: number; title?: string; body: string; verified?: boolean; createdAt: string; };
export type CoreData = { products: Product[]; brands: Brand[]; manufacturers: Manufacturer[]; medications: Medication[]; devices: Device[]; diseases: Disease[]; categories: Category[]; faqs: FAQ[]; articles: Article[]; reviews: Review[]; relationships: Relationship[]; };
