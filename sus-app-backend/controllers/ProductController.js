const Product = require('../models/Product');
const { tokenize, expandTokens, scoreProduct } = require('../utlis/searchScoring');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    const category = req.query.category ? Number(req.query.category) : null;
    const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;
    const limit = Math.min(Number(req.query.limit) || 24, 60);

    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const filter = {};

    if (category) {
      filter.categoryID = category;
    }

    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};

      if (minPrice !== null && !Number.isNaN(minPrice)) {
        filter.price.$gte = minPrice;
      }

      if (maxPrice !== null && !Number.isNaN(maxPrice)) {
        filter.price.$lte = maxPrice;
      }
    }

    const products = await Product.find(filter).lean();
    const queryTokens = tokenize(query);
    const expandedTokens = expandTokens(queryTokens);

    const results = products
      .map((product) => {
        const { score, reasons } = scoreProduct(product, queryTokens, expandedTokens);

        return {
          product,
          searchScore: Number(score.toFixed(4)),
          reasons: reasons.slice(0, 3)
        };
      })
      .filter((item) => item.searchScore > 0)
      .sort((left, right) => right.searchScore - left.searchScore || left.product.price - right.product.price)
      .slice(0, limit);

    return res.status(200).json({
      success: true,
      message: "Product search results",
      query,
      expandedTerms: expandedTokens.filter((token) => !queryTokens.includes(token)).slice(0, 12),
      count: results.length,
      results
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error searching products", error: err.message });
  }
};




exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryID } = req.params;
    const products = await Product.find({ categoryID: categoryID });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get product by productID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ productID: req.params.productID });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getProductByProductID = async (req, res) => {
  try {
    const { productID } = req.params;  // Extract productID from the request parameters
    const product = await Product.findOne({ productID: productID }); // Find the product by productID
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product); // Send back the product data
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

// Controller to get a product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id); 
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching product', error });
//   }
// };



// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
