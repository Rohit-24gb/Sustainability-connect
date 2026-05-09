const interactionSchema = {
  eventType: { required: true, type: "string", enum: ["view", "search", "search_click", "cart_add", "cart_remove", "purchase", "wishlist"] },
  sessionId: { required: true, type: "string", min: 8, max: 120 },
  userId: { required: false, type: "string", objectId: true },
  productId: { required: false, type: "string", objectId: true },
  query: { required: false, type: "string", max: 250 },
  category: { required: false, type: "string", max: 120 },
  scoreWeight: { required: false, type: "number" }
};

module.exports = { interactionSchema };
