import joi from "joi";

export const inputUserValidation = (payload) => {
  const schema = joi.object({
    name: joi.string().trim().min(1).max(100).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 1 character long',
      'string.max': 'Name must be less than or equal to 100 characters long'
    }),
    address: joi.string().trim().min(1).max(255).required().messages({
      'string.empty': 'Address is required',
      'string.min': 'Address must be at least 1 character long',
      'string.max': 'Address must be less than or equal to 255 characters long'
    }),
  });
  return schema.validate(payload, { abortEarly: false });
};

// New validation function for user updates (allows partial updates)
export const updateUserValidation = (payload) => {
  const schema = joi.object({
    name: joi.string().trim().min(1).max(100).messages({
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 1 character long',
      'string.max': 'Name must be less than or equal to 100 characters long'
    }),
    address: joi.string().trim().min(1).max(255).messages({
      'string.empty': 'Address cannot be empty',
      'string.min': 'Address must be at least 1 character long',
      'string.max': 'Address must be less than or equal to 255 characters long'
    }),
  });
  return schema.validate(payload, { abortEarly: false });
};

// New validation function for user IDs (UUID format)
export const userIdValidation = (payload) => {
  const schema = joi.object({
    id: joi.string().uuid().required().messages({
      'string.empty': 'User ID is required',
      'string.uuid': 'User ID must be a valid UUID'
    })
  });
  return schema.validate(payload, { abortEarly: false });
};

// New validation function for user search queries
export const searchUserValidation = (payload) => {
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