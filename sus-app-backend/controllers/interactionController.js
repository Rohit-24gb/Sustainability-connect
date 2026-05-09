const Interaction = require("../models/Interaction");

const normalizeInteraction = (body, user) => ({
  userId: user?._id || body.userId || null,
  productId: body.productId || null,
  eventType: body.eventType,
  query: body.query || "",
  category: body.category || "",
  scoreWeight: body.scoreWeight,
  sessionId: body.sessionId,
  metadata: body.metadata || {}
});

exports.createInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.create(normalizeInteraction(req.body, req.user));
    return res.success({ interaction }, "Interaction tracked", 201);
  } catch (error) {
    return res.fail(error.message || "Failed to track interaction", 400);
  }
};

exports.getUserInteractions = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const interactions = await Interaction.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate("productId", "name price categoryID image_url");

    return res.success({ interactions }, "User interactions");
  } catch (error) {
    return res.fail("Failed to fetch user interactions", 500);
  }
};

exports.getInteractionSummary = async (req, res) => {
  try {
    const since = req.query.since ? new Date(req.query.since) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const match = { timestamp: { $gte: since } };

    const [byEventType, topProducts, topQueries] = await Promise.all([
      Interaction.aggregate([
        { $match: match },
        { $group: { _id: "$eventType", count: { $sum: 1 }, score: { $sum: "$scoreWeight" } } },
        { $sort: { count: -1 } }
      ]),
      Interaction.aggregate([
        { $match: { ...match, productId: { $ne: null } } },
        { $group: { _id: "$productId", count: { $sum: 1 }, score: { $sum: "$scoreWeight" } } },
        { $sort: { score: -1 } },
        { $limit: 10 },
        { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
        { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
        { $project: { productId: "$_id", count: 1, score: 1, productName: "$product.name" } }
      ]),
      Interaction.aggregate([
        { $match: { ...match, eventType: "search", query: { $ne: "" } } },
        { $group: { _id: "$query", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    return res.success({
      since,
      byEventType,
      topProducts,
      topQueries
    }, "Interaction summary");
  } catch (error) {
    return res.fail("Failed to fetch interaction summary", 500);
  }
};
