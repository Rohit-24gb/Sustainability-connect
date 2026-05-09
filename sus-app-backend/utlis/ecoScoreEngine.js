const MATERIAL_SCORES = {
  bamboo: 95,
  organic: 90,
  cotton: 78,
  recycled: 88,
  paper: 72,
  glass: 82,
  steel: 80,
  metal: 74,
  wood: 76,
  jute: 88,
  cork: 84,
  silicone: 58,
  plastic: 28,
  polyester: 34,
  nylon: 32,
  chemical: 25
};

const PACKAGING_SCORES = {
  none: 95,
  "plastic-free": 92,
  compostable: 90,
  recycled: 84,
  paper: 76,
  cardboard: 78,
  minimal: 82,
  standard: 55,
  plastic: 28
};

const CATEGORY_BASE_CARBON = {
  1: 0.6,
  2: 0.8,
  3: 6.5,
  4: 4.2,
  5: 1.4,
  6: 2.1,
  7: 2.8,
  8: 1.1,
  9: 0.9,
  10: 2.5,
  11: 6.8
};

const tokenize = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
};

const inferMaterials = (product) => {
  const textTokens = new Set(tokenize(`${product.name || ""} ${product.description || ""}`));
  const existing = Array.isArray(product.materials) ? product.materials.filter(Boolean) : [];
  const inferred = Object.keys(MATERIAL_SCORES).filter((material) => textTokens.has(material));
  return Array.from(new Set([...existing, ...inferred]));
};

const scoreMaterials = (materials) => {
  if (!materials.length) {
    return 55;
  }

  const scores = materials.map((material) => MATERIAL_SCORES[String(material).toLowerCase()] || 55);
  return scores.reduce((total, score) => total + score, 0) / scores.length;
};

const scorePackaging = (packagingType = "standard") => {
  const normalized = String(packagingType).toLowerCase();
  return PACKAGING_SCORES[normalized] || 55;
};

const scoreCarbon = (carbonKgCO2e) => {
  if (carbonKgCO2e <= 0.5) return 95;
  if (carbonKgCO2e <= 1) return 86;
  if (carbonKgCO2e <= 2) return 72;
  if (carbonKgCO2e <= 5) return 52;
  if (carbonKgCO2e <= 10) return 34;
  return 18;
};

const inferPackaging = (product) => {
  if (product.packagingType && product.packagingType !== "standard") {
    return product.packagingType;
  }

  const text = `${product.name || ""} ${product.description || ""}`.toLowerCase();

  if (text.includes("plastic free") || text.includes("plastic-free")) return "plastic-free";
  if (text.includes("compostable")) return "compostable";
  if (text.includes("recycled packaging")) return "recycled";
  if (text.includes("paper packaging")) return "paper";
  if (text.includes("minimal packaging")) return "minimal";

  return product.packagingType || "standard";
};

const inferCarbon = (product, materials) => {
  if (typeof product.carbonKgCO2e === "number" && product.carbonKgCO2e > 0) {
    return product.carbonKgCO2e;
  }

  let carbon = CATEGORY_BASE_CARBON[product.categoryID] || 2;
  const materialText = materials.join(" ").toLowerCase();

  if (materialText.includes("bamboo") || materialText.includes("jute") || materialText.includes("cork")) {
    carbon *= 0.55;
  }

  if (materialText.includes("recycled")) {
    carbon *= 0.7;
  }

  if (materialText.includes("plastic") || materialText.includes("polyester")) {
    carbon *= 1.2;
  }

  return Number(carbon.toFixed(2));
};

const buildExplanation = ({ materials, packagingType, recyclable, durabilityScore, carbonKgCO2e, ecoScore }) => {
  const materialText = materials.length ? materials.join(", ") : "general materials";
  const recyclableText = recyclable ? "is recyclable" : "has limited recyclability information";
  const durabilityText = durabilityScore >= 75 ? "strong durability" : durabilityScore >= 50 ? "moderate durability" : "lower durability";

  return `Eco score ${ecoScore}/100: made with ${materialText}, uses ${packagingType} packaging, ${recyclableText}, has ${durabilityText}, and an estimated footprint of ${carbonKgCO2e} kg CO2e.`;
};

const calculateEcoScore = (product) => {
  const materials = inferMaterials(product);
  const packagingType = inferPackaging(product);
  const recyclable = Boolean(product.recyclable || materials.some((material) => ["glass", "steel", "metal", "paper", "recycled"].includes(String(material).toLowerCase())));
  const durabilityScore = typeof product.durabilityScore === "number" ? product.durabilityScore : 50;
  const carbonKgCO2e = inferCarbon(product, materials);

  const materialScore = scoreMaterials(materials);
  const packagingScore = scorePackaging(packagingType);
  const recyclabilityScore = recyclable ? 90 : 35;
  const durabilityComponent = Math.min(100, Math.max(0, durabilityScore));
  const carbonScore = scoreCarbon(carbonKgCO2e);

  const ecoScore = Math.round(
    (materialScore * 0.30)
    + (packagingScore * 0.20)
    + (recyclabilityScore * 0.20)
    + (durabilityComponent * 0.15)
    + (carbonScore * 0.15)
  );

  return {
    ecoScore,
    carbonKgCO2e,
    materials,
    packagingType,
    recyclable,
    durabilityScore: durabilityComponent,
    impactExplanation: buildExplanation({
      materials,
      packagingType,
      recyclable,
      durabilityScore: durabilityComponent,
      carbonKgCO2e,
      ecoScore
    })
  };
};

module.exports = { calculateEcoScore };
