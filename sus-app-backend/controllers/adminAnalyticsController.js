const User = require("../models/user");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Interaction = require("../models/Interaction");

const CATEGORY_NAMES = {
  1: "Personal Care",
  2: "Stationery",
  3: "Electronics",
  4: "Clothing",
  5: "Kitchen",
  6: "Accessories",
  7: "Household",
  8: "Cleaning",
  9: "Beauty",
  10: "Fitness",
  11: "Technology"
};

const percent = (part, total) => {
  if (!total) {
    return 0;
  }

  return Number(((part / total) * 100).toFixed(2));
};

const startOfDay = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

exports.getOverview = async (req, res) => {
  try {
    const since = req.query.since ? new Date(req.query.since) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const today = startOfDay(new Date());
    const matchSince = { timestamp: { $gte: since } };

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueRows,
      dailyActiveUsers,
      eventCounts,
      topProducts,
      topSearchQueries,
      noResultSearches,
      topSustainableCategories,
      ecoDistribution,
      recommendationRows,
      coldStartUsers
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Payment.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, revenue: { $sum: "$amount" } } }
      ]),
      Interaction.distinct("userId", { timestamp: { $gte: today }, userId: { $ne: null } }),
      Interaction.aggregate([
        { $match: matchSince },
        { $group: { _id: "$eventType", count: { $sum: 1 } } }
      ]),
      Interaction.aggregate([
        { $match: { ...matchSince, productId: { $ne: null } } },
        { $group: { _id: "$productId", events: { $sum: 1 }, score: { $sum: "$scoreWeight" } } },
        { $sort: { score: -1 } },
        { $limit: 8 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
        { $project: { productId: "$_id", productName: "$product.name", events: 1, score: 1, ecoScore: "$product.ecoScore" } }
      ]),
      Interaction.aggregate([
        { $match: { ...matchSince, eventType: "search", query: { $ne: "" } } },
        { $group: { _id: "$query", count: { $sum: 1 }, resultCount: { $avg: "$metadata.resultCount" } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Interaction.aggregate([
        { $match: { ...matchSince, eventType: "search", "metadata.resultCount": 0 } },
        { $group: { _id: "$query", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Product.aggregate([
        { $group: { _id: "$categoryID", avgEcoScore: { $avg: "$ecoScore" }, avgCarbon: { $avg: "$carbonKgCO2e" }, productCount: { $sum: 1 } } },
        { $sort: { avgEcoScore: -1 } },
        { $limit: 8 }
      ]),
      Product.aggregate([
        {
          $bucket: {
            groupBy: "$ecoScore",
            boundaries: [0, 40, 60, 75, 90, 101],
            default: "unknown",
            output: { count: { $sum: 1 } }
          }
        }
      ]),
      Interaction.aggregate([
        { $match: { ...matchSince, "metadata.source": { $in: ["recommendations", "recommended_products", "semantic_recommendations"] } } },
        { $group: { _id: "$eventType", count: { $sum: 1 } } }
      ]),
      Interaction.aggregate([
        { $match: matchSince },
        { $group: { _id: "$userId", events: { $sum: 1 } } },
        { $match: { events: { $lte: 1 } } },
        { $count: "count" }
      ])
    ]);

    const counts = Object.fromEntries(eventCounts.map((item) => [item._id, item.count]));
    const recommendationCounts = Object.fromEntries(recommendationRows.map((item) => [item._id, item.count]));
    const productViews = counts.view || 0;
    const cartAdds = counts.cart_add || 0;
    const purchases = counts.purchase || 0;
    const searches = counts.search || 0;
    const recommendationImpressions = recommendationCounts.view || 0;
    const recommendationClicks = recommendationCounts.search_click || recommendationCounts.view || 0;
    const recommendationPurchases = recommendationCounts.purchase || 0;

    const products = await Product.find().select("carbonKgCO2e").lean();
    const estimatedCarbonSaved = products.reduce((total, product) => {
      const baseline = 5;
      return total + Math.max(0, baseline - (product.carbonKgCO2e || baseline));
    }, 0);

    return res.success({
      since,
      overview: {
        totalUsers,
        dailyActiveUsers: dailyActiveUsers.filter(Boolean).length,
        totalProducts,
        totalOrders,
        totalRevenue: revenueRows[0]?.revenue || 0,
        productViews,
        cartAdds,
        purchases,
        searches,
        cartConversionRate: percent(purchases, cartAdds),
        viewToCartRate: percent(cartAdds, productViews),
        estimatedCarbonSavedKg: Number(estimatedCarbonSaved.toFixed(2))
      },
      aiMetrics: {
        recommendationImpressions,
        recommendationClicks,
        recommendationPurchases,
        recommendationCtr: percent(recommendationClicks, recommendationImpressions),
        recommendationPurchaseRate: percent(recommendationPurchases, recommendationClicks),
        coldStartUsers: coldStartUsers[0]?.count || 0
      },
      topProducts,
      topSearchQueries,
      noResultSearches,
      topSustainableCategories: topSustainableCategories.map((item) => ({
        ...item,
        categoryName: CATEGORY_NAMES[item._id] || `Category ${item._id}`,
        avgEcoScore: Number((item.avgEcoScore || 0).toFixed(2)),
        avgCarbon: Number((item.avgCarbon || 0).toFixed(2))
      })),
      ecoDistribution,
      topExplanationReasons: [
        { reason: "High sustainability score", count: await Product.countDocuments({ ecoScore: { $gte: 75 } }) },
        { reason: "Lower estimated carbon footprint", count: await Product.countDocuments({ carbonKgCO2e: { $lte: 2 } }) },
        { reason: "Recyclable product attributes", count: await Product.countDocuments({ recyclable: true }) }
      ]
    }, "Admin analytics overview");
  } catch (error) {
    return res.fail("Failed to fetch admin analytics", 500);
  }
};
