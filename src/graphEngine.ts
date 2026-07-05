import { CoreData, ID, NodeType, Relationship } from './types.js';

type GraphNode = {
  id: ID;
  type: NodeType;
  data: unknown;
};

const collectionByNodeType: Record<NodeType, keyof CoreData | undefined> = {
  Product: 'products',
  Brand: 'brands',
  Manufacturer: 'manufacturers',
  Category: 'categories',
  Disease: 'diseases',
  Medication: 'medications',
  Device: 'devices',
  Article: 'articles',
  FAQ: 'faqs',
  Video: undefined,
  Review: 'reviews',
  Bundle: undefined,
};

const nodeTypeAliases: Record<string, NodeType> = {
  product: 'Product',
  products: 'Product',
  brand: 'Brand',
  brands: 'Brand',
  manufacturer: 'Manufacturer',
  manufacturers: 'Manufacturer',
  category: 'Category',
  categories: 'Category',
  disease: 'Disease',
  diseases: 'Disease',
  medication: 'Medication',
  medications: 'Medication',
  device: 'Device',
  devices: 'Device',
  article: 'Article',
  articles: 'Article',
  faq: 'FAQ',
  faqs: 'FAQ',
  video: 'Video',
  videos: 'Video',
  review: 'Review',
  reviews: 'Review',
  bundle: 'Bundle',
  bundles: 'Bundle',
};

function relationships(data: CoreData) {
  return data.relationships ?? [];
}

function normalizeNodeType(type: string): NodeType | null {
  const directMatch = Object.keys(collectionByNodeType).find(nodeType => nodeType === type) as NodeType | undefined;
  return directMatch ?? nodeTypeAliases[type.toLowerCase()] ?? null;
}

function findNodeData(data: CoreData, type: NodeType, id: ID) {
  const collectionName = collectionByNodeType[type];
  if (!collectionName) return null;

  const collection = data[collectionName] as Array<{ id: ID }>;
  return collection.find(item => item.id === id) ?? null;
}

function toGraphNode(data: CoreData, type: NodeType, id: ID): GraphNode | null {
  const nodeData = findNodeData(data, type, id);
  if (!nodeData) return null;

  return { id, type, data: nodeData };
}

function uniqueNodes(nodes: GraphNode[]) {
  const seen = new Set<string>();
  return nodes.filter(node => {
    const key = `${node.type}:${node.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function connectedNodes(data: CoreData, graphRelationships: Relationship[]) {
  const nodes = graphRelationships.flatMap(relationship => {
    const source = toGraphNode(data, relationship.sourceType, relationship.sourceId);
    const target = toGraphNode(data, relationship.targetType, relationship.targetId);
    return [source, target].filter((node): node is GraphNode => node !== null);
  });

  return uniqueNodes(nodes);
}

export function getGraph(data: CoreData) {
  const graphRelationships = relationships(data);

  return {
    nodes: connectedNodes(data, graphRelationships),
    relationships: graphRelationships,
  };
}

export function getGraphNodes(data: CoreData, query: { type?: string } = {}) {
  const type = query.type ? normalizeNodeType(query.type) : null;
  const graphNodes = getGraph(data).nodes;

  return type ? graphNodes.filter(node => node.type === type) : graphNodes;
}

export function getRelationships(data: CoreData, query: Partial<Pick<Relationship, 'sourceType' | 'sourceId' | 'type' | 'targetType' | 'targetId'>>) {
  const sourceType = query.sourceType ? normalizeNodeType(query.sourceType) : null;
  const targetType = query.targetType ? normalizeNodeType(query.targetType) : null;

  return relationships(data).filter(relationship =>
    (!query.sourceType || relationship.sourceType === sourceType) &&
    (!query.sourceId || relationship.sourceId === query.sourceId) &&
    (!query.type || relationship.type === query.type) &&
    (!query.targetType || relationship.targetType === targetType) &&
    (!query.targetId || relationship.targetId === query.targetId)
  );
}

export function getRelationship(data: CoreData, id: ID) {
  return relationships(data).find(relationship => relationship.id === id) ?? null;
}

export function getNodeGraph(data: CoreData, type: string, id: ID) {
  const nodeType = normalizeNodeType(type);
  if (!nodeType) return null;

  const node = toGraphNode(data, nodeType, id);
  if (!node) return null;

  const outgoing = relationships(data).filter(relationship => relationship.sourceType === nodeType && relationship.sourceId === id);
  const incoming = relationships(data).filter(relationship => relationship.targetType === nodeType && relationship.targetId === id);
  const graphRelationships = [...outgoing, ...incoming];

  return {
    node,
    outgoing,
    incoming,
    relationships: graphRelationships,
    connectedNodes: uniqueNodes(connectedNodes(data, graphRelationships).filter(connectedNode => connectedNode.id !== id || connectedNode.type !== nodeType)),
  };
}

export function getProductGraph(data: CoreData, slug: string) {
  const product = data.products.find(item => item.slug === slug || item.sku === slug || item.id === slug);
  if (!product) return null;

  return getNodeGraph(data, 'Product', product.id);
}
