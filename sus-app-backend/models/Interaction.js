const mongoose = require("mongoose");

const eventWeights = {
  view: 1,
  search: 2,
  search_click: 2,
  cart_add: 4,
  cart_remove: -2,
  purchase: 8,
  wishlist: 3
};

const interactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
  eventType: {
    type: String,
    enum: Object.keys(eventWeights),
    required: true
  },
  query: { type: String, trim: true, default: "" },
  category: { type: String, trim: true, default: "" },
  scoreWeight: { type: Number },
  sessionId: { type: String, trim: true, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true }
}, { collection: "interactions" });

interactionSchema.pre("validate", function setScoreWeight(next) {
  if (this.scoreWeight === undefined || this.scoreWeight === null) {
    this.scoreWeight = eventWeights[this.eventType] || 0;
  }

  next();
});

interactionSchema.index({ userId: 1, timestamp: -1 });
interactionSchema.index({ productId: 1, timestamp: -1 });
interactionSchema.index({ eventType: 1, timestamp: -1 });
interactionSchema.index({ sessionId: 1, timestamp: -1 });

module.exports = mongoose.model("Interaction", interactionSchema);
module.exports.eventWeights = eventWeights;
