import { CoreData, ID, Product, RelationshipType } from './types.js';

export type RecommendationQuery = {
  problem?: ID;
  problemId?: ID;
  problemSlug?: string;
  medication?: ID;
  medicationId?: ID;
  device?: ID;
  deviceId?: ID;
  diabetesType?: ID;
  disease?: ID;
  diseaseId?: ID;
  category?: ID;
  categoryId?: ID;
  travel?: boolean;
  limit?: number;
};

type RecommendationReason = {
  code: string;
  message: string;
};

type RecommendationResult = {
  product: Product;
  score: number;
  reasons: RecommendationReason[];
};

function relatedIds(data: CoreData, productId: ID, type: RelationshipType, fallbackIds: ID[] = []) {
  const ids = data.relationships
    .filter(relationship => relationship.sourceType === 'Product' && relationship.sourceId === productId && relationship.type === type)
    .map(relationship => relationship.targetId);

  return ids.length > 0 ? ids : fallbackIds;
}

function resolveProblemId(data: CoreData, query: RecommendationQuery) {
  const value = query.problemId ?? query.problemSlug ?? query.problem;
  if (!value) return undefined;

  return data.problems.find(problem => problem.id === value || problem.slug === value || problem.name.toLowerCase() === value.toLowerCase())?.id;
}

function problemName(data: CoreData, id: ID) {
  return data.problems.find(problem => problem.id === id)?.name ?? 'the requested problem';
}

function medicationName(data: CoreData, id: ID) {
  return data.medications.find(medication => medication.id === id)?.name ?? 'the requested medication';
}

function requestedMedication(query: RecommendationQuery) {
  return query.medicationId ?? query.medication;
}

function requestedDevice(query: RecommendationQuery) {
  return query.deviceId ?? query.device;
}

function requestedDisease(query: RecommendationQuery) {
  return query.diseaseId ?? query.disease ?? query.diabetesType;
}

function requestedCategory(query: RecommendationQuery) {
  return query.categoryId ?? query.category;
}

function addReason(reasons: RecommendationReason[], code: string, message: string) {
  reasons.push({ code, message });
}

function scoreProduct(data: CoreData, product: Product, query: RecommendationQuery): RecommendationResult | null {
  let score = 0;
  const reasons: RecommendationReason[] = [];

  const problemId = resolveProblemId(data, query);
  const medicationId = requestedMedication(query);
  const deviceId = requestedDevice(query);
  const diseaseId = requestedDisease(query);
  const categoryId = requestedCategory(query);

  if (problemId) {
    const problemIds = relatedIds(data, product.id, 'recommended_for_problem');
    if (!problemIds.includes(problemId)) return null;
    score += 40;
    addReason(reasons, 'problem_match', `Matches ${problemName(data, problemId).toLowerCase()}`);
  }

  if (medicationId) {
    const medicationIds = relatedIds(data, product.id, 'compatible_with_medication', product.compatibleMedicationIds);
    if (!medicationIds.includes(medicationId)) return null;
    score += 20;
    addReason(reasons, 'medication_match', `Compatible with ${medicationName(data, medicationId)}`);
  }

  if (deviceId) {
    const deviceIds = relatedIds(data, product.id, 'compatible_with_device', product.compatibleDeviceIds);
    if (!deviceIds.includes(deviceId)) return null;
    score += 20;
    addReason(reasons, 'device_match', 'Product is compatible with the requested device.');
  }

  if (diseaseId) {
    const diseaseIds = relatedIds(data, product.id, 'recommended_for_disease', product.diabetesTypes);
    if (!diseaseIds.includes(diseaseId)) return null;
    score += 15;
    addReason(reasons, 'disease_match', 'Product is relevant to the requested diabetes type or disease.');
  }

  if (categoryId) {
    const categoryIds = relatedIds(data, product.id, 'belongs_to_category', product.categoryIds);
    if (!categoryIds.includes(categoryId)) return null;
    score += 10;
    addReason(reasons, 'category_match', 'Product belongs to the requested category.');
  }

  if (query.travel === true) {
    if (!product.travelFriendly) return null;
    score += 10;
    addReason(reasons, 'travel_match', 'Travel-friendly product');
  }

  if (score === 0) {
    score = 1;
    addReason(reasons, 'general_match', 'Product is available in the MDS Core catalog.');
  }

  return { product, score, reasons };
}

export function recommendProductsV1(data: CoreData, query: RecommendationQuery) {
  const limit = Math.max(1, Math.min(Number(query.limit ?? 10), 50));
  const recommendations = data.products
    .map(product => scoreProduct(data, product, query))
    .filter((recommendation): recommendation is RecommendationResult => recommendation !== null)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .slice(0, limit);

  return {
    engine: 'recommendation-engine-v1',
    query,
    count: recommendations.length,
    recommendations,
  };
}
