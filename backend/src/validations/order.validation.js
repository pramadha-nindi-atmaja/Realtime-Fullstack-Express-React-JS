import Joi from "joi";

export const inputOrderValidation = (payload) => {
  const schema = Joi.object({
    productId: Joi.number().required(),
    qty: Joi.number().min(1).required(),
    customerName: Joi.string().min(3).max(100).required(),
    customerEmail: Joi.string().email().required(),
    customerPhone: Joi.string().min(10).max(20).optional(),
    shippingAddress: Joi.string().min(10).max(500).required(),
  });

  return schema.validate(payload);
};

export const updateOrderValidation = (payload) => {
  const schema = Joi.object({
    productId: Joi.number().optional(),
    qty: Joi.number().min(1).optional(),
    customerName: Joi.string().min(3).max(100).optional(),
    customerEmail: Joi.string().email().optional(),
    customerPhone: Joi.string().min(10).max(20).optional(),
    shippingAddress: Joi.string().min(10).max(500).optional(),
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').optional()
  });

  return schema.validate(payload);
};