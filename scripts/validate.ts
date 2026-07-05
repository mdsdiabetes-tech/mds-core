import { loadCore } from '../src/dataStore.js';
import { CoreData, NodeType, RelationshipType } from '../src/types.js';

const data = await loadCore();
const required = ['products','brands','manufacturers','medications','devices','diseases','categories','faqs','articles','reviews','relationships'];
for (const key of required) if (!Array.isArray((data as any)[key])) throw new Error(`Missing array: ${key}`);

const nodeTypes = new Set<NodeType>([
  'Product',
  'Brand',
  'Manufacturer',
  'Category',
  'Disease',
  'Medication',
  'Device',
  'Article',
  'FAQ',
  'Video',
  'Review',
  'Bundle',
]);
const relationshipTypes = new Set<RelationshipType>([
  'belongs_to_brand',
  'made_by_manufacturer',
  'belongs_to_category',
  'compatible_with_device',
  'compatible_with_medication',
  'recommended_for_disease',
  'related_product',
  'alternative_product',
  'has_faq',
  'has_article',
  'has_video',
  'has_review',
  'included_in_bundle',
]);

function idsFor(type: NodeType, core: CoreData) {
  switch (type) {
    case 'Product': return new Set(core.products.map(i => i.id));
    case 'Brand': return new Set(core.brands.map(i => i.id));
    case 'Manufacturer': return new Set(core.manufacturers.map(i => i.id));
    case 'Category': return new Set(core.categories.map(i => i.id));
    case 'Disease': return new Set(core.diseases.map(i => i.id));
    case 'Medication': return new Set(core.medications.map(i => i.id));
    case 'Device': return new Set(core.devices.map(i => i.id));
    case 'Article': return new Set(core.articles.map(i => i.id));
    case 'FAQ': return new Set(core.faqs.map(i => i.id));
    case 'Review': return new Set(core.reviews.map(i => i.id));
    case 'Video':
    case 'Bundle':
      return new Set<string>();
  }
}

for (const relationship of data.relationships) {
  if (!relationship.id) throw new Error('Relationship missing id');
  if (!nodeTypes.has(relationship.sourceType)) throw new Error(`Invalid relationship sourceType: ${relationship.sourceType}`);
  if (!nodeTypes.has(relationship.targetType)) throw new Error(`Invalid relationship targetType: ${relationship.targetType}`);
  if (!relationshipTypes.has(relationship.type)) throw new Error(`Invalid relationship type: ${relationship.type}`);
  if (!idsFor(relationship.sourceType, data).has(relationship.sourceId)) {
    throw new Error(`Relationship ${relationship.id} has missing source: ${relationship.sourceType}:${relationship.sourceId}`);
  }
  if (!idsFor(relationship.targetType, data).has(relationship.targetId)) {
    throw new Error(`Relationship ${relationship.id} has missing target: ${relationship.targetType}:${relationship.targetId}`);
  }
}

console.log('MDS Core data validated:', required.map(k => `${k}=${(data as any)[k].length}`).join(', '));
