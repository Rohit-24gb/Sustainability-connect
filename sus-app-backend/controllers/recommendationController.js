const Product = require("../models/Product");
const Interaction = require("../models/Interaction");

const POSITIVE_EVENTS = ["view", "search_click", "cart_add", "purchase", "wishlist"];
const NEGATIVE_EVENTS = ["cart_remove"];
const MATRIX_EVENTS = [...POSITIVE_EVENTS, ...NEGATIVE_EVENTS];

const tokenize = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
};

const productTokens = (product) => {
  return new Set(tokenize(`${product.name || ""} ${product.description || ""}`));
};

const jaccardSimilarity = (left, right) => {
  if (!left.size || !right.size) {
    return 0;
  }

  let intersection = 0;
  for (const token of left) {
    if (right.has(token)) {
      intersection += 1;
    }
  }

  const union = left.size + right.size - intersection;
  return union ? intersection / union : 0;
};

const priceSimilarity = (left, right) => {
  if (!left || !right) {
    return 0;
  }

  const distance = Math.abs(left - right) / Math.max(left, right);
  return Math.max(0, 1 - distance);
};

const normalizeProductId = (productId) => {
  if (!productId) {
    return null;
  }

  if (productId._id) {
    return productId._id.toString();
  }

  return productId.toString();
};

const normalizeActorId = (interaction) => {
  if (interaction.userId) {
    return `user:${interaction.userId.toString()}`;
  }

  if (interaction.sessionId) {
    return `session:${interaction.sessionId}`;
  }

  return null;
};

const cosineSimilarity = (left, right) => {
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (const value of left.values()) {
    leftNorm += value * value;
  }

  for (const [productId, value] of right.entries()) {
    rightNorm += value * value;
    dot += value * (left.get(productId) || 0);
  }

  if (!leftNorm || !rightNorm || dot <= 0) {
    return 0;
  }

  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
};

const buildPopularity = async () => {
  const rows = await Interaction.aggregate([
    { $match: { eventType: { $in: POSITIVE_EVENTS }, productId: { $ne: null } } },
    { $group: { _id: "$productId", score: { $sum: "$scoreWeight" }, count: { $sum: 1 } } }
  ]);

  const maxScore = rows.reduce((max, row) => Math.max(max, row.score || 0), 0) || 1;
  return new Map(rows.map((row) => [row._id.toString(), Math.max(0, row.score || 0) / maxScore]));
};

const buildCollaborativeSignals = (allInteractions, { userId, sessionId }) => {
  const targetActor = userId ? `user:${userId}` : `session:${sessionId}`;
  const matrix = new Map();
  const targetPositiveIds = new Set();

  for (const interaction of allInteractions) {
    const actorId = normalizeActorId(interaction);
    const productId = normalizeProductId(interaction.productId);

    if (!actorId || !productId) {
      continue;
    }

    if (!matrix.has(actorId)) {
      matrix.set(actorId, new Map());
    }

    const weight = interaction.scoreWeight || 0;
    const vector = matrix.get(actorId);
    vector.set(productId, (vector.get(productId) || 0) + weight);

    if (actorId === targetActor && weight > 0) {
      targetPositiveIds.add(productId);
    }
  }

  const targetVector = matrix.get(targetActor);

  if (!targetVector || !targetVector.size) {
    return {
      scores: new Map(),
      similarActors: 0,
      maxSimilarity: 0
    };
  }

  const rawScores = new Map();
  let similarActors = 0;
  let maxSimilarity = 0;

  for (const [actorId, vector] of matrix.entries()) {
    if (actorId === targetActor) {
      continue;
    }

    const similarity = cosineSimilarity(targetVector, vector);

    if (similarity <= 0) {
      continue;
    }

    similarActors += 1;
    maxSimilarity = Math.max(maxSimilarity, similarity);

    for (const [productId, weight] of vector.entries()) {
      if (targetPositiveIds.has(productId) || weight <= 0) {
        continue;
      }

      rawScores.set(productId, (rawScores.get(productId) || 0) + (similarity * weight));
    }
  }

  const maxScore = Math.max(...rawScores.values(), 0) || 1;
  const scores = new Map(
    Array.from(rawScores.entries()).map(([productId, score]) => [
      productId,
      Math.min(1, score / maxScore)
    ])
  );

  return {
    scores,
    similarActors,
    maxSimilarity: Number(maxSimilarity.toFixed(4))
  };
};

const getFallbackProducts = async (limit, popularity) => {
  const products = await Product.find().lean();

  return products
    .map((product) => ({
      product,
      score: (0.65 * (popularity.get(product._id.toString()) || 0)) + (0.35 * ((product.ecoScore || 50) / 100))
    }))
    .sort((left, right) => right.score - left.score || right.product.productID - left.product.productID)
    .slice(0, limit)
    .map(({ product, score }) => ({
      product,
      recommendationScore: Number(score.toFixed(4)),
      reasons: score > 0 ? ["Popular with sustainability shoppers"] : ["New product to explore"]
    }));
};

const buildRecommendations = async ({ userId, sessionId, limit = 8 }) => {
  const match = {
    eventType: { $in: MATRIX_EVENTS },
    productId: { $ne: null }
  };

  if (userId) {
    match.userId = userId;
  } else {
    match.sessionId = sessionId;
  }

  const [interactions, products, popularity, allInteractions] = await Promise.all([
    Interaction.find(match)
      .sort({ timestamp: -1 })
      .limit(100)
      .populate("productId")
      .lean(),
    Product.find().lean(),
    buildPopularity(),
    Interaction.find({ eventType: { $in: MATRIX_EVENTS }, productId: { $ne: null } })
      .sort({ timestamp: -1 })
      .limit(5000)
      .select("userId sessionId productId eventType scoreWeight")
      .lean()
  ]);

  if (!products.length) {
    return [];
  }

  if (!interactions.length) {
    return getFallbackProducts(limit, popularity);
  }

  const sourceProducts = interactions
    .filter((interaction) => interaction.productId)
    .map((interaction) => ({
      product: interaction.productId,
      weight: interaction.scoreWeight || 0,
      eventType: interaction.eventType
    }));

  const sourceIds = new Set(
    sourceProducts
      .filter((source) => source.weight > 0)
      .map((source) => source.product._id.toString())
  );

  const purchasedIds = new Set(
    sourceProducts
      .filter((source) => source.eventType === "purchase")
      .map((source) => source.product._id.toString())
  );

  const sourceTokenCache = sourceProducts.map((source) => ({
    ...source,
    tokens: productTokens(source.product)
  }));

  const collaborative = buildCollaborativeSignals(allInteractions, { userId, sessionId });
  const maxProductId = Math.max(...products.map((item) => item.productID || 1), 1);

  const recommendations = products
    .filter((product) => !purchasedIds.has(product._id.toString()))
    .map((product) => {
      const targetTokens = productTokens(product);
      const productId = product._id.toString();
      let contentScore = 0;
      let totalWeight = 0;
      const reasonSet = new Set();

      for (const source of sourceTokenCache) {
        const weight = source.weight;
        const absWeight = Math.abs(weight);

        if (!absWeight) {
          continue;
        }

        const categoryScore = source.product.categoryID === product.categoryID ? 1 : 0;
        const textScore = jaccardSimilarity(source.tokens, targetTokens);
        const priceScore = priceSimilarity(source.product.price, product.price);
        const similarity = (0.45 * categoryScore) + (0.35 * textScore) + (0.20 * priceScore);

        contentScore += similarity * weight;
        totalWeight += absWeight;

        if (weight > 0 && categoryScore) {
          reasonSet.add(`Similar category to ${source.product.name}`);
        }

        if (weight > 0 && textScore > 0) {
          reasonSet.add(`Matches product themes you explored`);
        }
      }

      const normalizedContent = totalWeight ? Math.max(0, contentScore / totalWeight) : 0;
      const collaborativeScore = collaborative.scores.get(productId) || 0;
      const popularityScore = popularity.get(productId) || 0;
      const ecoScore = (product.ecoScore || 50) / 100;
      const freshnessScore = product.productID ? product.productID / maxProductId : 0;
      const categoryBoost = sourceIds.has(productId) ? 0.05 : 0;
      const finalScore = (0.35 * normalizedContent)
        + (0.25 * collaborativeScore)
        + (0.20 * ecoScore)
        + (0.10 * popularityScore)
        + (0.10 * freshnessScore)
        + categoryBoost;

      if (collaborativeScore > 0) {
        reasonSet.add("Users with similar eco-shopping activity also interacted with this");
      }

      if (popularityScore > 0.25) {
        reasonSet.add("Popular among users with eco-shopping activity");
      }

      if ((product.ecoScore || 0) >= 75) {
        reasonSet.add("High sustainability score");
      }

      if (!reasonSet.size) {
        reasonSet.add("Good fit based on recent product activity");
      }

      return {
        product,
        recommendationScore: Number(finalScore.toFixed(4)),
        rankingSignals: {
          contentSimilarity: Number(normalizedContent.toFixed(4)),
          collaborativeScore: Number(collaborativeScore.toFixed(4)),
          ecoScore: Number(ecoScore.toFixed(4)),
          popularity: Number(popularityScore.toFixed(4)),
          freshness: Number(freshnessScore.toFixed(4))
        },
        reasons: Array.from(reasonSet).slice(0, 3)
      };
    })
    .filter((item) => item.recommendationScore > 0)
    .sort((left, right) => right.recommendationScore - left.recommendationScore)
    .slice(0, limit);

  recommendations.meta = {
    strategy: "hybrid-content-collaborative-eco",
    formula: "0.35 content + 0.25 collaborative + 0.20 eco + 0.10 popularity + 0.10 freshness",
    similarActors: collaborative.similarActors,
    maxActorSimilarity: collaborative.maxSimilarity
  };

  return recommendations;
};

exports.getUserRecommendations = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 8, 20);
    const recommendations = await buildRecommendations({ userId: req.params.userId, limit });

    return res.success({
      recommendations,
      meta: recommendations.meta || {}
    }, "Hybrid personalized recommendations");
  } catch (error) {
    return res.fail("Failed to build recommendations", 500);
  }
};

exports.getSessionRecommendations = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 8, 20);
    const recommendations = await buildRecommendations({
      sessionId: req.params.sessionId,
      limit
    });

    return res.success({
      recommendations,
      meta: recommendations.meta || {}
    }, "Hybrid session recommendations");
  } catch (error) {
    return res.fail("Failed to build recommendations", 500);
  }
};
