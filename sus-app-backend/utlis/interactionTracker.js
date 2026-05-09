const Interaction = require("../models/Interaction");
const logger = require("./logger");

const recordInteraction = async (event) => {
  try {
    if (!event || !event.eventType || !event.sessionId) {
      return null;
    }

    return await Interaction.create(event);
  } catch (error) {
    logger.warn("interaction_tracking_failed", {
      message: error.message,
      eventType: event?.eventType
    });
    return null;
  }
};

module.exports = { recordInteraction };
