const objectId = { required: true, type: "string", objectId: true };

const productSchema = {
  name: { required: true, type: "string", min: 2, max: 120 },
  productID: { required: true, type: "number", minValue: 1 },
  price: { required: true, type: "number", minValue: 0 },
  categoryID: { required: true, type: "number", minValue: 1 }
};

const cartAddSchema = {
  userId: objectId,
  productId: objectId,
  quantity: { required: true, type: "number", minValue: 1 }
};

const cartRemoveSchema = {
  userId: objectId,
  productId: objectId
};

const paymentOrderSchema = {
  amount: { required: true, type: "number", minValue: 1 },
  currency: { required: true, type: "string", min: 3, max: 3 }
};

const paymentCompleteSchema = {
  paymentId: { required: true, type: "string", min: 3, max: 200 },
  orderId: { required: true, type: "string", min: 3, max: 200 },
  userId: objectId,
  totalAmount: { required: true, type: "number", minValue: 1 },
  sessionId: { required: false, type: "string", min: 8, max: 120 },
  cartItems: {
    required: true,
    type: "array",
    minItems: 1,
    items: {
      productId: objectId,
      quantity: { required: true, type: "number", minValue: 1 },
      price: { required: true, type: "number", minValue: 0 }
    }
  }
};

module.exports = {
  productSchema,
  cartAddSchema,
  cartRemoveSchema,
  paymentOrderSchema,
  paymentCompleteSchema
};
