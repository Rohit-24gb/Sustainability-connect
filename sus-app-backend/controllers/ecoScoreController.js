const Product = require("../models/Product");
const { calculateEcoScore } = require("../utlis/ecoScoreEngine");

exports.previewEcoScore = async (req, res) => {
  try {
    const ecoProfile = calculateEcoScore(req.body);
    return res.success({ ecoProfile }, "Eco score preview");
  } catch (error) {
    return res.fail("Failed to calculate eco score", 500);
  }
};

exports.updateProductEcoScore = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.fail("Product not found", 404);
    }

    const mergedProduct = {
      ...product.toObject(),
      ...req.body
    };
    const ecoProfile = calculateEcoScore(mergedProduct);

    Object.assign(product, req.body, ecoProfile);
    await product.save();

    return res.success({ product }, "Product eco score updated");
  } catch (error) {
    return res.fail("Failed to update product eco score", 500);
  }
};

exports.recalculateAllEcoScores = async (req, res) => {
  try {
    const products = await Product.find();

    await Promise.all(products.map((product) => {
      Object.assign(product, calculateEcoScore(product.toObject()));
      return product.save();
    }));

    return res.success({ updatedCount: products.length }, "Product eco scores recalculated");
  } catch (error) {
    return res.fail("Failed to recalculate eco scores", 500);
  }
};
