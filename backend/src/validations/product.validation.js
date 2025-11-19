import joi from "joi";

export const inputProductValidation = (payload) => {
  const schema = joi.object({
    name: joi.string().trim().min(1).max(100).required().messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 1 character long',
      'string.max': 'Product name must be less than or equal to 100 characters long'
    }),
    qty: joi.number().integer().min(0).required().messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be greater than or equal to 0'
    }),
    price: joi.number().min(0).precision(2).required().messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be greater than or equal to 0',
      'number.precision': 'Price must have at most 2 decimal places'
    }),
  });
  return schema.validate(payload, { abortEarly: false });
};

// New validation function for product updates (allows partial updates)
export const updateProductValidation = (payload) => {
  const schema = joi.object({
    name: joi.string().trim().min(1).max(100).messages({
      'string.empty': 'Product name cannot be empty',
      'string.min': 'Product name must be at least 1 character long',
      'string.max': 'Product name must be less than or equal to 100 characters long'
    }),
    qty: joi.number().integer().min(0).messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be greater than or equal to 0'
    }),
    price: joi.number().min(0).precision(2).messages({
      'number.base': 'Price must be a number',
      'number.min': 'Price must be greater than or equal to 0',
      'number.precision': 'Price must have at most 2 decimal places'
    }),
  });
  return schema.validate(payload, { abortEarly: false });
};

// New validation function for product search queries
export const searchProductValidation = (payload) => {
  const schema = joi.object({
    query: joi.string().trim().min(1).max(100).required().messages({
      'string.empty': 'Search query is required',
      'string.min': 'Search query must be at least 1 character long',
      'string.max': 'Search query must be less than or equal to 100 characters long'
    }),
    page: joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be greater than or equal to 1'
    }),
    limit: joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be greater than or equal to 1',
      'number.max': 'Limit must be less than or equal to 100'
    })
  });
  return schema.validate(payload, { abortEarly: false });
};

// New validation function for product IDs
export const productIdValidation = (payload) => {
  const schema = joi.object({
    id: joi.number().integer().positive().required().messages({
      'number.base': 'Product ID must be a number',
      'number.integer': 'Product ID must be an integer',
      'number.positive': 'Product ID must be a positive number'
    })
  });
  return schema.validate(payload, { abortEarly: false });
};