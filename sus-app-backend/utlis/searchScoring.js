const CATEGORY_LABELS = {
  1: "personal care hygiene bamboo toothbrush soap shampoo skin body",
  2: "stationery paper notebook pen office student school",
  3: "electronics gadgets device charger tech",
  4: "clothing apparel fabric cotton wearable fashion",
  5: "kitchen utensil food storage bottle container reusable",
  6: "accessories bag wallet daily carry",
  7: "household home decor cleaning storage",
  8: "cleaning cleaner soap detergent home",
  9: "beauty skincare cosmetic personal care",
  10: "fitness gym yoga health sport bottle",
  11: "technology electronics device gadget"
};

const SYNONYMS = {
  eco: ["sustainable", "green", "environment", "earth", "reusable"],
  sustainable: ["eco", "green", "environment", "reusable"],
  plastic: ["zero", "waste", "reusable", "bamboo"],
  "plastic-free": ["plastic", "free", "zero", "waste"],
  low: ["cheap", "affordable", "budget"],
  carbon: ["emission", "footprint", "climate"],
  student: ["school", "college", "stationery", "notebook"],
  kitchen: ["food", "storage", "container", "utensil"],
  personal: ["care", "hygiene", "beauty"],
  gift: ["accessory", "useful", "daily"]
};

const tokenize = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
};

const expandTokens = (tokens) => {
  const expanded = new Set(tokens);

  tokens.forEach((token) => {
    (SYNONYMS[token] || []).forEach((synonym) => expanded.add(synonym));
  });

  return Array.from(expanded);
};

const buildProductSearchText = (product) => {
  return [
    product.name,
    product.description,
    CATEGORY_LABELS[product.categoryID],
    product.price <= 500 ? "affordable budget under 500 low price" : "",
    product.price <= 1000 ? "under 1000" : ""
  ].join(" ");
};

const scoreProduct = (product, queryTokens, expandedTokens) => {
  const nameTokens = tokenize(product.name);
  const descriptionTokens = tokenize(product.description);
  const categoryTokens = tokenize(CATEGORY_LABELS[product.categoryID]);
  const allText = tokenize(buildProductSearchText(product));
  const allTokenSet = new Set(allText);
  const reasons = new Set();
  let score = 0;

  queryTokens.forEach((token) => {
    if (nameTokens.includes(token)) {
      score += 5;
      reasons.add("Direct match in product name");
    }

    if (descriptionTokens.includes(token)) {
      score += 3;
      reasons.add("Matches product description");
    }

    if (categoryTokens.includes(token)) {
      score += 4;
      reasons.add("Fits the searched category intent");
    }
  });

  expandedTokens.forEach((token) => {
    if (allTokenSet.has(token) && !queryTokens.includes(token)) {
      score += 1.5;
      reasons.add("Related sustainability term match");
    }
  });

  const coverage = queryTokens.filter((token) => allTokenSet.has(token)).length / Math.max(queryTokens.length, 1);
  score += coverage * 6;

  if (product.ecoScore) {
    score += (product.ecoScore / 100) * 2;
  }

  if (queryTokens.includes("eco") || queryTokens.includes("sustainable") || queryTokens.includes("green")) {
    score += ((product.ecoScore || 50) / 100) * 4;
    reasons.add("Strong sustainability score");
  }

  if (queryTokens.includes("affordable") || queryTokens.includes("budget") || queryTokens.includes("cheap")) {
    const priceScore = Math.max(0, 1 - (product.price || 0) / 1500);
    score += priceScore * 4;
    reasons.add("Good fit for budget-conscious search");
  }

  if (queryTokens.includes("low") && queryTokens.includes("carbon")) {
    const carbonScore = product.carbonKgCO2e ? Math.max(0, 1 - product.carbonKgCO2e / 10) : 0.5;
    score += 1 + (carbonScore * 5);
    reasons.add("Lower estimated carbon impact");
  }

  if ((queryTokens.includes("recyclable") || queryTokens.includes("recycle")) && product.recyclable) {
    score += 5;
    reasons.add("Recyclable product attributes");
  }

  return {
    score,
    reasons: Array.from(reasons)
  };
};

module.exports = {
  CATEGORY_LABELS,
  tokenize,
  expandTokens,
  scoreProduct
};
